
function showTip () {
	var sidTip;
	sidTip = document.getElementById("sidTip"); 		
	sidTip.style.display = "inline";  					
}

function hideTip () {  									
	var sidTip;
	sidTip = document.getElementById("sidTip");			
	sidTip.style.display = "none";					
}

function init () {										
	var sid;											
	sid = document.getElementById("sid");				
	sid.onmouseover = showTip;							
	sid.onmouseout = hideTip;
	var pwd1;											
	pwd1 = document.getElementById("pwd1");				
	pwd1.onmouseover = showTip1;							
	pwd1.onmouseout = hideTip1;
	var pwd2;											
	pwd2 = document.getElementById("pwd2");				
	pwd2.onmouseover = showTip2;							
	pwd2.onmouseout = hideTip2;							
}

function showTip1 () {
	var pwd1Tip;
	pwd1Tip = document.getElementById("pwd1Tip"); 		
	pwd1Tip.style.display = "inline";
}

function hideTip1 () {
	var pwd1Tip;
	pwd1Tip = document.getElementById("pwd1Tip"); 		
	pwd1Tip.style.display = "none"; 
}

function showTip2 () {
	var pwd2Tip;
	pwd2Tip = document.getElementById("pwd2Tip"); 		
	pwd2Tip.style.display = "inline";
}

function hideTip2 () {
	var pwd2Tip;
	pwd2Tip = document.getElementById("pwd2Tip"); 		
	pwd2Tip.style.display = "none"; 
}

window.onload = init;								    