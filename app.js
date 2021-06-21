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
const listSchema = {
  name: String,
  items:  [itemsSchema]
}
const List = mongoose.model('List',listSchema)

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
    res.render('list', {listTitle: 'Today', newListItems: foundItems})
  }

})

  // const day = date.getDate()

})

app.get('/:customListName',function(req,res){
  const customListName = req.params.customListName
List.findOne({name: customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      // create a new list
      const list = new List({
        name:customListName,
        items: defaultItems
      })
    list.save()
    res.redirect('list' + customListName)
    } else{
      // show an exist list
      res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
    }
  }
})

})



app.post('/', function(req, res) {
  const itemName = req.body.newItem
  const listName = req.body.list
 const item = new Item({
   name: itemName
 })

 if(listName ===  'Today'){
   item.save()
   res.redirect('/')
}else{
  List.findOne({name: listName},function(err,foundList){
    foundList.items.push(item)
    foundList.save()
    res.redirect('/' + listName)
  })
}

})

app.post('/delete',function(req,res){
  console.log(req.body.checkbox);
  const checkItmemId = req.body.checkbox
Item.findByIdAndRemove(checkItmemId,function(err){
  if(!err){
    console.log("Successfully Remove Item");
    res.redirect('/')
  }

})

})


app.get('/about',function(req,res){
  res.render('about')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
