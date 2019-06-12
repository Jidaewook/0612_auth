module.exports = {
    signUp: async(req, res, next) => {
        console.log('signUp()');
    }, 
    signIn: async (req, res, next) => {
        console.log('signIn()');
    },
    secret: async (req, res, next) => {
        console.log('secret()');
    }
};