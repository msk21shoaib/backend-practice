//this is just a bundler code that will help further as the code will be used more than once

/*
const asyncHandler = () => {}   ------- usual
const asyncHandler = (func) => { async () => {} }  
*/

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

/*
const asyncHandler = (func) => async (req,res,next) => {
    try{

    } catch(error) {
        res.status(err.code || 500).json({
            success:false,
            message: err.message
        })
    }
}
*/
