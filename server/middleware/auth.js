import jwt from 'jsonwebtoken';


// it is a middleware. when it's done, we call next()
// I don't know, how it is different from a simple async
// ok, we use it in posts routes where we first call auth,
// and then perform the action we want to perform
const auth = async (req, res, next) => {
  try {
    // token comes in the headers
    const token = req.headers.authorization.split(" ")[1];
    // less than 500 means it's our token (not a google one)
    const isCustomAuth = token.length < 500;

    let decodedData;

    // if we're working with our own token
    if (token && isCustomAuth) {
      // it's giving us data (username, id) for each token
      // we use token and the same secret phrase as when we 
      // signed the token in controllers
      decodedData = jwt.verify(token, 'test');


      req.userId = decodedData?.id;
    }
    // if we're working with google token
    else {
      decodedData = jwt.decode(token);

      // google's name for google id that is unique for each user
      req.userId = decodedData?.sub;
    }

    next();

  } catch (error) {
    console.log(error);
  }
}

export default auth;