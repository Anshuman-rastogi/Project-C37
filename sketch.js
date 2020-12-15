//Create variables here
var dog, dogImg, happyDogImg, database, foodS, foodStock;
var feedTime, lastFed;
var feed, addFood;
var foodObj;
var gameState = "Hungry", changeState, readState;
var bedroom, garden, washroom;

function preload()
{
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/Happy.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  
  database = firebase.database();
  createCanvas(400, 500);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(200,380,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed = createButton("Feed Buddy🥛🍖");
  feed.position(515,65);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food🥛🍗");
  addFood.position(640,65);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 15,30);
  }
  else if(lastFed==0){
     text("Last Feed : 12 AM",15,30);
  }
  else{
     text("Last Feed : "+ lastFed + " AM", 15,30);
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }


  drawSprites();

}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });  
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
  dog.addImage(dogImg);
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}