/* ===================================================================
   Firestore sync — loaded on demand, only when sync is switched on.
   Nothing here runs (or is even downloaded) if you never enable sync,
   so the app stays fully usable where Google services are blocked.

   Layout in Firestore:
     users/{uid}/txs/{txId}     one doc per transaction
     users/{uid}/tomb/{txId}    tombstone, so deletes travel between devices
   =================================================================== */

const V = "10.14.1";
const CDN = `https://www.gstatic.com/firebasejs/${V}`;

let app=null, db=null, auth=null, unsub=null, fs=null, currentUid=null, handlers={};

async function sdk(){
  const [appMod, authMod, dbMod] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`)
  ]);
  return { appMod, authMod, dbMod };
}

export async function connect(config, opts){
  handlers = opts || {};
  const say = (s,m) => handlers.onStatus && handlers.onStatus(s,m);

  const { appMod, authMod, dbMod } = await sdk();
  fs = dbMod;

  app  = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(config);
  auth = authMod.getAuth(app);

  // Local cache first: writes land instantly and queue while offline.
  try{
    db = dbMod.initializeFirestore(app, {
      localCache: dbMod.persistentLocalCache({ tabManager: dbMod.persistentMultipleTabManager() })
    });
  }catch(e){
    db = dbMod.getFirestore(app);
  }

  const user = await signIn(authMod, opts && opts.interactive, say);
  if(!user) throw new Error("Sign-in was cancelled");
  currentUid = user.uid;

  authMod.onAuthStateChanged(auth, u => {
    if(!u){ say("off","Signed out"); if(unsub){ unsub(); unsub=null; } }
  });

  watch(say);
  return { uid: user.uid, email: user.email || null };
}

/** A persisted session loads from storage asynchronously — checking currentUser
 *  before that finishes makes an already-signed-in user look signed out. */
function authReady(authMod){
  if(typeof auth.authStateReady === "function") return auth.authStateReady();
  return new Promise(resolve => {
    const stop = authMod.onAuthStateChanged(auth, () => { stop(); resolve(); });
  });
}

async function signIn(authMod, interactive, say){
  await authReady(authMod);
  if(auth.currentUser) return auth.currentUser;

  const redirected = await authMod.getRedirectResult(auth).catch(()=>null);
  if(redirected && redirected.user) return redirected.user;

  if(!interactive){
    const e = new Error("Not signed in on this install");
    e.code = "needs-signin";
    throw e;
  }

  say("connecting","Waiting for sign-in…");
  const provider = new authMod.GoogleAuthProvider();
  try{
    const res = await authMod.signInWithPopup(auth, provider);
    return res.user;
  }catch(err){
    // Mobile Safari and installed PWAs commonly block the popup.
    if(["auth/popup-blocked","auth/popup-closed-by-user","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"].includes(err.code)){
      say("connecting","Redirecting to sign in…");
      await authMod.signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

function watch(say){
  if(unsub){ unsub(); unsub=null; }
  const txCol   = fs.collection(db, "users", currentUid, "txs");
  const tombCol = fs.collection(db, "users", currentUid, "tomb");

  let txs=[], tomb=[], ready=0;
  const emit = () => { if(ready>=2 && handlers.onRemote) handlers.onRemote(txs, tomb); };

  const u1 = fs.onSnapshot(txCol,
    snap => {
      txs = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      if(ready<2) ready++;
      say(snap.metadata.fromCache ? "syncing" : "on", snap.metadata.fromCache ? "Offline — will sync later" : "Synced");
      emit();
    },
    err => say("error", friendly(err)));

  const u2 = fs.onSnapshot(tombCol,
    snap => { tomb = snap.docs.map(d => ({ id:d.id, up:(d.data()||{}).up||0 })); if(ready<2) ready++; emit(); },
    err => say("error", friendly(err)));

  unsub = () => { u1(); u2(); };
}

export async function push(txs, tomb){
  if(!db || !currentUid) return;
  const batch = fs.writeBatch(db);
  let n = 0;
  for(const t of txs){
    batch.set(fs.doc(db, "users", currentUid, "txs", String(t.id)), {
      amt:t.amt, cur:t.cur, type:t.type, cat:t.cat, note:t.note||"", ts:t.ts, up:t.up||Date.now()
    }, { merge:true });
    if(++n >= 450) break;                       // Firestore caps a batch at 500 writes
  }
  for(const d of (tomb||[]).slice(-50)){
    batch.set(fs.doc(db, "users", currentUid, "tomb", String(d.id)), { up:d.up||Date.now() });
    batch.delete(fs.doc(db, "users", currentUid, "txs", String(d.id)));
  }
  await batch.commit();
}

export async function disconnect(){
  if(unsub){ unsub(); unsub=null; }
  currentUid = null;
}

function friendly(err){
  const c = err && err.code || "";
  if(c.includes("permission-denied")) return "Firestore rules rejected this — check the rules in README";
  if(c.includes("unavailable")) return "Can't reach Firestore — offline?";
  if(c.includes("unauthenticated")) return "Signed out — turn sync on again";
  return (err && err.message ? String(err.message) : "Sync error").slice(0, 70);
}
