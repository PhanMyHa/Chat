export const authUser=async(req,res)=>{
    try {
       const user=req.user //middleware
       return res.status(200).json({user})
    } catch (error) {
        console.error("loi khi goi authUser", error);
        return res.status(500).json({ message: "loi he thong" });
    }
}