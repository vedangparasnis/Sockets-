const passport = require("passport");
const Google = require("passport-google-oauth20");
const Facebook = require("passport-facebook");
const key = "AIzaSyAT_hDrRZqQOgA97jYKE3ARauS84F5IcGo";
const {
  client: { clientID, clientSecret }
} = require("../../public/js/files");
const { facebook } = require("../../public/js/files");
const firebase = require("firebase");

// configure strategy

passport.serializeUser((user, done) => {
  // save to cookie
  done(null, user.data().id);
});

passport.deserializeUser((id, done) => {
  firebase
    .firestore()
    .collection("googleUsers")
    .limit(1)
    .where("id", "==", id)
    .get()
    .then(msg => {
      // user is present here now
      done(null, msg.docs[0].data().id);
    });
});

passport.use(
  new Google(
    {
      clientID,
      clientSecret,
      callbackURL: "/chat/dataGoogle"

      // options configure
    },
    (accessToken, refreshToken, profile, done) => {
      const { id, displayName } = profile;
      const photo = profile.photos[0].value;
      firebase
        .firestore()
        .collection("googleUsers")
        .limit(1)
        .where("displayName", "==", displayName)
        .get()
        .then(user => {
          if (user.docs.length !== 0) {
            console.log("user present there");
            // next stage serialize as google id
            done(null, user.docs[0]);
          } else {
            const cred = {
              id,
              displayName,
              photo
            };
            firebase
              .firestore()
              .collection("googleUsers")
              .add(cred)
              .then(msg => {
                console.log(profile);
                done(null, cred);
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    }
  )
);

passport.use(
  new Facebook(
    {
      clientID: facebook.clientID,
      clientSecret: facebook.clientSecret,
      callbackURL: "/chat/dataFacebook"
      // options configure
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(facebook);
    }
  )
);
