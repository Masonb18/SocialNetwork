const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

mongoose.connect('mongodb://localhost/social-network-api',{
    useNewUrlParser: true,
    useUnifiesTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}).then(()=> {
    console.log('Connected to Mongodb');

    app.listen(PORT, () =>{
        console.log('Server running on port 3001')
    });
}).catch((error) => {
    console.error('Error connecting', error);
});
