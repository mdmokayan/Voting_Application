const express = require('express')
const candidateRouter = express.Router()
const Candidate = require('./../models/candidate')
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const User = require("../models/user")

const checkAdminRole = async (data)=>{
    try {
        const userCheck = await User.findById(data);
         if(userCheck.role === 'admin'){
            return true
        }
    } catch (error) {
        return false
    }
}

//POST route to add candidate
candidateRouter.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkAdminRole(req.userJWT.id)) 
            return res.status(403).json({message: 'user does have not admin role'})

      const data = req.body; //Assuming the request body contains the candidate data
      //console.log('req Data', data);
      
      // Create a new candidate document using the mongoose model
      const newCandidate = new Candidate(data);
  
      // Save the new user to the database
      const response = await newCandidate.save();
      console.log('data saved');
  
      res.status(200).json({ response: response});
    }catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//PUT route to add user password
candidateRouter.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (! await checkAdminRole(req.userCheck.id)) 
        return res.status(403).json({message: 'user does have not admin role'})

    const candidatePut = req.params.candidateID //extract the id from the URL parameter
    const updateCandidateData = req.body //update data for the person

    const responce = await User.findByIdAndUpadte(candidatePut, updateCandidateData)

    if (!responce) {
      return res.status(401).json({ error: 'candidate not found' })
    }

    console.log('candidate data updated')
    res.status(200).json({ responce})
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal put server error' })
  }
})

//DELETE route to add user password
candidateRouter.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (! await checkAdminRole(req.userCheck.id)) 
        return res.status(403).json({message: 'user does have not admin role'})

    const candidateDelete = req.params.candidateID //extract the id from the URL parameter

    const responce = await User.findByIdAndDelete(candidateDelete)


    if (!responce) {
        return res.status(404).json({error: 'candidate not found'})
    }

    console.log('candidate delete')
    res.status(200).json({ responce })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal delete server error' })
  }
})

//let's start voting
candidateRouter.post('/vote/:candidateID',jwtAuthMiddleware, async (req, res)=>{
    //no admin can vote
    //user can only vote once

    candidateID = req.params.candidateID;
    userID = req.userJWT.id

    try {
        //find the candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID)
        if (!candidate) {
            return res.status(404).json({message: 'Candidate not found'})
        }
        
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if (user.isVoted) {
            return res.status(404).json({message: 'you have already voted'})
        }

        if (user.role == 'admin') {
            res.status(401).json({message: 'admin is not allowed'})
        }

        //Update the candidate document to record the vote
        candidate.votes.push({user: userID})
        candidate.voteCount++
        await candidate.save()

        //upadate the user document
        user.isVoted = true
        await user.save()

        res.status(200).json({message: 'vote recorded successfuly'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal Server error'})
    }
})

//vote count
candidateRouter.get('/vote/count', async (req, res) => {
    try {
        //Find all candidates and sort them by vote count in descendind order
        const candidateCount = await Candidate.find().sort({voteCount: 'desc'})

        //Map the candidates to only return their name and vote count
        const VoteRecord = candidateCount.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json(VoteRecord)
    } catch (error) {
        console.log(err)
        res.status(500).json({message: 'Internal Server error'})
    }
})

module.exports = candidateRouter
