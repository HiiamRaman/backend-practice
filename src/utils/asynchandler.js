// const asynchandler = ()=>{
//     ()=>{}
// }
// this fucntion cann be written as 


// export const asynchandler =(func)=>{
// return async (req,res,next)=>{
// try {
//     await func(req,res,next)
// } catch (error) {
//     res.status(error.code || 500).json({
//         success : false,
//         message: error.message
//     })  //res.status(...) → sets the HTTP status code for the response
// }

// }
// }


// ANOTHER WWAY OF THIS CODE


 const asynchandler = (fn)=> {
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((error)=>{
            next(error)
        })

    }

}
export  default asynchandler;
