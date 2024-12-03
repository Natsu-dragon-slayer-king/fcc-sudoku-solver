const Transport = new HTTPTransport("https://localhost:5000");
$("#solve-form",{
	onsubmit:async function(event){
		event.preventDefault();
		const response =  await Transport.packupData("#solve-form").post("/api/solve");
		return response.solution ? displayPuzzle(response.solution) : $(".resulting-message")[0].textContent = JSON.stringify(response)
	}
})

$("#check-form",{
	onsubmit:async function(event){
		event.preventDefault();
		const response =  await Transport.packupData(["#solve-form", this],{noEmpties:true}).post("/api/check");
		$(".resulting-message")[0].textContent = JSON.stringify(response);
	}
})

document.addEventListener("DOMContentLoaded", (event)=>{
	displayPuzzle($("#puzzle-textarea")[0].value);
})

$("#puzzle-textarea", {
	onkeyup:function(event){
		displayPuzzle(this.value);
	}
})
function displayPuzzle(puzzleValues){
	$(".sudoku-input",{
		execute:function(element, i){
			if(puzzleValues[i] === "."){
				element.textContent = "";
				return;
			}
			element.textContent = puzzleValues[i]
		}
	})
}
