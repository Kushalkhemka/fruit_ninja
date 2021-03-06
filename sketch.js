//Declaration of variables
var bg, bg_img;
var sword,sword_img;
var inv1,inv2,inv3,inv4;
var fruit;
var fruit1_img,fruit2_img,fruit3_img,fruit4_img;
var fruitGroup;
var monster;
var monster_anim;
var enemyGroup;
//Scoring and losing system
var score;
var chances;
//Game States
var PLAY=1;
var END=0;
var gameState=PLAY;
//Restart & gameOver 
var gameOver,gameOver_img;
var restart,restart_img;
//Sounds
var cutSound,gameOverSound,restartMusic,bombSound;

function preload()
{
  //To load sword image
  sword_img=loadImage("sword.png");
  
  bg_img=loadImage("fruitninja.jpg");
  
  //To load fruits image
  fruit1_img=loadImage("fruit1.png");
  fruit2_img=loadImage("fruit2.png");
  fruit3_img=loadImage("fruit3.png");
  fruit4_img=loadImage("fruit4.png");
  
  //To load monsters image
  monster_anim=loadAnimation("alien1.png","alien2.png");
  
  //To load gameOver image
  gameOver_img=loadImage("gameover.png");
  
  //To load restart image
  restart_img=loadImage("restart.png");
  
  //To load sounds 
  cutSound=loadSound("swoosh1.mp3");
  gameOverSound=loadSound("gameOver.mp3");
  restartMusic=loadSound("gameOver1.mp3");
  bombSound=loadSound("bomb.wav");
  //gameSound=loadSound("gameSound.wav");
}

function setup()
{
  //400,400
  
  //To create a canvas
  createCanvas(windowWidth,windowHeight);
  
  bg=createSprite(width/2,height/2);
  
  //To create sword sprite and its properties
  sword=createSprite(width/2,height/2,10,10);
  sword.addImage(sword_img);
  sword.scale=0.6;
  //sword.debug=true;
  sword.setCollider("circle",0,0,20);
  
  //To create invisible boundaries to collide with sword
  inv1=createSprite(width/2,2,width,4);
  inv1.visible=false;
  inv2=createSprite(width/2,398,width,4);
  inv2.visible=false;
  inv3=createSprite(width-398,height/2,4,width);
  inv3.visible=false;
  inv4=createSprite(width-4,height/2,4,width);
  inv4.visible=false;
  
  //To create new Groups
  fruitGroup=new Group();
  enemyGroup=new Group();
  
  //To assign initial value to score var
  score=0;
  //To assign initial value to chances
  chances=3;
  
  //To create GameOver sprite
  gameOver=createSprite(width/2,height/2,10,10);
  gameOver.addImage(gameOver_img);
  gameOver.scale=1;
  
  //To create restart sprite
  restart=createSprite(width/2,height-150,10,10);
  restart.addImage(restart_img);
  restart.scale=0.3;
  
}

function draw()
{
  bg.addImage(bg_img);
  //To assign a background to programme
  background("azure");
  

  if(score>0&&score%5===0)
  {
    background("yellow");
  } else if(score>0&&score%2===0)
  {
    background("lightgrey");
  }
  
  
  if(gameState===PLAY)
  {
   
    if(touches.length>0)
    {
     //To make sword move along the mouse in all directions 
     sword.y=World.mouseY;
     sword.x=World.mouseX;
    }
  
   //To collide sword with invisible boundaries
   sword.collide(inv1);
   sword.collide(inv2);
   sword.collide(inv3);
   sword.collide(inv4);
  
   //To call fruits and enemy function in draw()
   fruits();
   enemy();
    
   //To increase score when sword cuts fruits
   if(sword.isTouching(fruitGroup))
   {
     fruitGroup.destroyEach();
     score=score+1;
     //To add swoosh sound when knife cuts fruits
     cutSound.play();
     
   }
  
   //To decrease chances when sword touches ememy
   if(sword.isTouching(enemyGroup))
   {
     enemyGroup.destroyEach();
     chances=chances-1;
     bombSound.play();
   }
     
   gameOver.visible=false;
   restart.visible=false;
    
  } 
   else if(gameState===END)
  {
    fruitGroup.setVelocityEach(0);
    enemyGroup.setVelocityEach(0);
    fruitGroup.destroyEach();
    enemyGroup.destroyEach();
    
    sword.x=width/2;
    sword.y=height-250;
    gameOver.visible=true;
    restart.visible=true;
  }
    
  //Reset the game once it gets over
  if(mousePressedOver(restart))
  {
    gameState=PLAY;
    score=0;
    chances=3;
    //NEFFEX MUSIC
    //restartMusic.play();
    gameOverSound.play();
  }
 
  
  //End Condition
  if(chances===0)
  {
    gameState=END;

  }
  
  //To draw the sprites
  drawSprites();
  
  //To display scores
  fill("white");
  textSize(20);
  text("Score: "+score,width-90,30);
  //To display chances
  text("Chances: "+chances,15,30);
}

function fruits()
{
  //To make it visible after every 75 frames 
  if(World.frameCount%75===0)
  {
  //To create fruit sprite
  fruit=createSprite(width-20,height/2);
  //To switch between different fruits
  sf=Math.round(random(1,4));
  
  if(sf===1)
  {
    fruit.addImage(fruit1_img); 
  } 
  else if (sf===2)
  {
    fruit.addImage(fruit2_img);
  }
  else if(sf===3)
  {
    fruit.addImage(fruit3_img);
  }
  else
  {
    fruit.addImage(fruit4_img);
  }
    
  //Scaling of fruit img
  fruit.scale=0.170;
  
  //To place fruit randomly in vertical position
  fruit.y=Math.round(random(50,height-50));

  //To assign velocity to fruit
  fruit.velocityX=-4;
  //To assign lifetime to fruit to avoid memory leaks
  fruit.setLifetime=width/fruit.velocityX;
  
  //To add fruit in fruitGroup
  fruitGroup.add(fruit);
  
  //To make fruit appear from both sides
  changefruit=Math.round(random(1,2))
  if(changefruit===1)
    {
      fruit.velocityX=-(4.5+score/4);
      fruit.x=400;
    }
    else if(changefruit===2)
    {
      fruit.velocityX=(4.5+score/4);
      fruit.x=0;
    }
  }
  
}

function enemy()
{
  //To make enemy appear after every 150 frames
  if(World.frameCount%150===0)
  {
  //To create monster sprite
  monster=createSprite(width,height/2);
  //To place it randomly on y axis/vertical position
  monster.y=Math.round(random(50,height-50));
  //To add animation
  monster.addAnimation("moving",monster_anim);
  //To assign velocity to monster
  monster.velocityX=-5;
  //To assign lifetime to avoid memory leaks
  monster.setLifetime=width/monster.velocityX;
  //To add monster in enemyGroup
  enemyGroup.add(monster);
    
  //To make monster appear from both sides
  changemonster=Math.round(random(1,2));
  if(changemonster===1)
    {
      monster.velocityX=-(5+score/10);
      monster.x=width;
    }
    else if(changemonster===2)
    {
      monster.velocityX=(5+score/10);
      monster.x=0;
      
    }
  }
  
}
