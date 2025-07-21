import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";


export const getAllJobs= catchAsyncErrors(async(req,res,next)=>{
    const jobs=await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs
    })
})

export const postJob= catchAsyncErrors(async(req,res,next)=>{
    const {role} = req.user;
    if (role==="job Seeker"){
        return next(new ErrorHandler("You are not authorized to post a job",403));
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
      } = req.body; 
    if(!title || !description || !category || !country || !city || !location){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    
    if ((!salaryFrom || !salaryTo)&& !fixedSalary){
        return next(new ErrorHandler( "Please either provide fixed salary or ranged salary.",400));
    }
    if (salaryFrom && salaryTo && fixedSalary){
        return next(new ErrorHandler("Cannot provide both fixed salary and ranged salary.",400));
    }
    const postedBy=req.user._id;
    const job=await Job.create({title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo,postedBy});
    res.status(201).json({
        success:true,
        job,
        message:"Job posted successfully"
    })   
})

export const getMyJobs= catchAsyncErrors(async(req,res,next)=>{
    const {role}=req.user;
    if (role==="job Seeker"){
        return next(new ErrorHandler("job Seeker not authorized to get your jobs",403));
    }
    const myJobs=await Job.find({postedBy:req.user._id});
    if (!myJobs){
        return next(new ErrorHandler("No jobs found",404));
    }
    res.status(200).json({
        success:true,
        myJobs
    })
})

export const updateJob= catchAsyncErrors(async(req,res,next)=>{
    const {role}=req.user;
    if (role==="job Seeker"){
        return next(new ErrorHandler("job Seeker not authorized to update a job",403));
    }
    const {id}=req.params;
    let job=await Job.findById(id);
    if (!job){
        return next(new ErrorHandler("Job not found",404));
    }
    job = await Job.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        job,
        message:"Job updated successfully"
    })
})  

export const deleteJob= catchAsyncErrors(async(req,res,next)=>{
    const {role}=req.user;
    if (role==="job Seeker"){
        return next(new ErrorHandler("job Seeker not authorized to delete a job",403));
    }
    const {id}=req.params;
    const job=await Job.findById(id);
    if (!job){
        return next(new ErrorHandler("Job not found",404));
    }
    await Job.deleteOne();
    res.status(200).json({
        success:true,
        message:"Job deleted successfully"
    })
})

export const getSingleJob= catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    const job=await Job.findById(id);
    if (!job){
        return next(new ErrorHandler("Job not found",404));
    }
    res.status(200).json({
        success:true,
        job
    })
})
