const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const date = require(__dirname + '/date.js')

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static ('public'))
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = {
  name: String
}

const Item = mongoose.model('item',itemsSchema)

const item1 =new Item({
  name: 'Eat'
})

const item2 = new Item ({
  name: 'Sleep'
})

const item3 = new Item ({
  name: 'Code'
})

const defaultItems = [item1,item2,item3]


app.get('/', (req, res) => {

Item.find({},function(err,foundItems){
  if(foundItems===0){
    Item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Successfully Save default items to Database');
      }
    })
    res.redirect('/')
  }else{
    res.render('list', {listTitle: day, newListItems: foundItems})
  }

})

  const day = date.getDate()

})

// Item.find({},function(err,items){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(items);
//   }
// })

app.post('/', function(req, res) {
  const itemName = req.body.newItem
 const item = new Item({
   name: itemName
 })
 item.save()
 res.redirect('/')

})


app.get('/work',function(req,res){
  const day = date.getOnlyDay()
  res.render('list',{listTitle: day +'s, Work', newListItems: workItem})
})

app.get('/about',function(req,res){
  res.render('about')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
