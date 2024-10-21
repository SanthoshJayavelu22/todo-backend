const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())



mongoose.connect('mongodb+srv://santhoshjayavelu57:FFQflCmEjHcyq5xQ@todoapp.lmeo6.mongodb.net/?retryWrites=true&w=majority&appName=todoapp')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));


const todoSchema = new mongoose.Schema(
    {
        title: {
            required: true,
            type: String
        },
        description:  {
            required: true,
            type: String
        }
    }
)

const todoModel = mongoose.model('Todo', todoSchema);



app.post("/todo" , async (req,res)=>{
  const {title, description} = req.body;


    try{
      const newTodo = new todoModel({title, description});
      await newTodo.save();
      res.status(201).json(newTodo);
    } catch  (error){
        console.log(error);
        res.status(500).json({message: error.message});

}
  
})


app.get("/todo" , async (req, res) =>{
   try{
   const todoGet = await todoModel.find();
   res.json(todoGet);

   } catch (error){
    console.log(error);
    res.status(500).json({message: error.message});

   }
   
})


app.put("/todo/:id", async (req, res)=>{

    try{
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title, description},
        {new: true}
    )

    if (!updatedTodo){
        return res.status(404).json({message:"todo not found"});
    }
    res.json(updatedTodo);

} catch (error){
    console.log(error);
    res.status(500).json({message: error.message});

}
})


app.delete("/todo/:id", async (req,res)=>{
    try{
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }

})

const port = 8000;
app.listen(port, () =>{
    console.log(`Server is Listening on Port ${port}`)
})