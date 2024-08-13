import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import userModel from "../server/models/user.js" 
import Result from '../server/models/result.js';

mongoose.connect("mongodb+srv://rakesh531:Rakesh531@nexus.3xtf4c2.mongodb.net/").then(()=>{
    console.log("Connected");
}).catch((err)=>{console.log("couldn't Connect")})

const app = express();



app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("HI");
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await userModel.findOne({ mail: email });

      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      if (user.password !== password) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful", redirectUrl: "/Client_side/Html/quiz.html" });
  } catch (err) {
      console.error("Sign-in error:", err);
      res.status(500).json({ message: "Server error" });
  }
});


app.post("/signup", async (req, res) => {
    const { name, mail, password } = req.body;
    try {
      const existingUser = await userModel.findOne({ mail });
      if (existingUser) {
          console.log(existingUser);
        return res.status(400).json({ message: "User already exists" });
      }
      console.log(name,mail,password)
      const newUser = new userModel({ name, mail, password });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

// Route to save quiz results
app.post('/save-results', async (req, res) => {
    const { correctAnswers, wrongAnswers, totalTimeSpent } = req.body;

    try {
        const result = new Result({
            correctAnswers,
            wrongAnswers,
            totalTimeSpent
        });
        await result.save();
        res.status(200).json({ message: 'Results saved successfully' });
    } catch (err) {
        console.error('Error saving results:', err);
        res.status(500).json({ message: 'Error saving results' });
    }
});


app.get('/profile', async (req, res) => {
    try {
        // Aggregating results data
        const profileData = await Result.aggregate([
            {
                $group: {
                    _id: null,
                    totalCorrectAnswers: { $sum: "$correctAnswers" },
                    totalWrongAnswers: { $sum: "$wrongAnswers" },
                    totalTimeSpent: { $sum: "$totalTimeSpent" }
                }
            }
        ]);

        if (profileData.length === 0) {
            return res.status(404).json({ message: 'No results found' });
        }

        res.status(200).json(profileData[0]);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Error fetching profile data' });
    }
});


app.listen(4000,()=>{
    console.log("HELLO!")
})
