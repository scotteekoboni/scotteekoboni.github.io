<!-- Author: Brian Mackenzie -->
<!-- Date: 11th March 2004 -->
<!-- Version: 1.0 -->
<!-- Function:  Calculate the results from the Squats test -->
<!-- Required by: squatest.htm -->
<!-- Copyright Brian Mackenzie 2004 -->

function pcalculate()
{
  asses = new Array ("Excellent","Good","Above Average","Average","Below Average","Poor","Very Poor");
  mscore = new Array(50,44,39,35,31,25,0,0,0,0,46,40,35,31,29,22,0,0,0,0,42,35,30,27,23,17,0,0,0,0,36,29,25,22,18,13,0,0,0,0,32,25,21,17,13,9,0,0,0,0,29,22,19,15,11,7,0,0,0,0);
  fscore = new Array(44,37,33,29,25,18,0,0,0,0,40,33,29,25,21,13,0,0,0,0,34,27,23,19,15,7,0,0,0,0,28,22,18,14,10,5,0,0,0,0,25,18,13,10,7,3,0,0,0,0,24,17,14,11,5,2,0,0,0,0);
  
  var dist = document.perform.dist.value;
  var age = document.perform.age.options[document.perform.age.selectedIndex].value;
  var gender = document.perform.gender.options[document.perform.gender.selectedIndex].value;

  age=(age-1)*10;
  dist = dist *1;

  if (gender=="Male")
    {
      while (dist<mscore[age])
      {age = age+1};
    }

  if (gender=="Female")
    {
      while (dist<fscore[age])
      {age = age+1};
    }

  while (age>=10)
  {age = age-10};

  document.perform.assess.value = asses[age];
}

function pclear()
{
  document.perform.assess.value = "";
}