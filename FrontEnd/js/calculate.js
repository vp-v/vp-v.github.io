function calculate() {
    let input1 = document.getElementById("ele").value;
    let input2 = document.getElementById("ga").value;
    let parsedInput1 = parseFloat(input1);
    let parsedInput2 = parseFloat(input2);

    if (isNaN(parsedInput1)||isNaN(parsedInput2)) {
      window.alert("Please enter number only. And type in all the fields.");
    } else {
      let calculatedValue = (parsedInput1 + parsedInput2)*8.75*0.5;
      localStorage.setItem('calculatedValue', calculatedValue);
      window.location.href = "result.html?value=" + calculatedValue;
    }
  }