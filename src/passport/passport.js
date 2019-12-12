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
          } else {
            firebase
              .firestore()
              .collection("googleUsers")
              .add({
                id,
                displayName,
                photo
              })
              .then(msg => {
                console.log(profile);
              })
              .catch(err => {
                console.log(err);
              });
          }
        });
    }
  )
);
//   if (!user.exists) {
//     console.log("same user again");
//   } else {
//
//   }

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
