function calculate() {
    var input1 = document.getElementById("ele").value;
    var input2 = document.getElementById("ga").value;
    var parsedInput1 = parseFloat(input1);
    var parsedInput2 = parseFloat(input2);

    if (isNaN(parsedInput1)||isNaN(parsedInput2)) {
      window.alert("Please enter number only.");
    } else {
      var calculatedValue = (parsedInput1 + parsedInput2)*105;
      window.location.href = "result.html?value=" + calculatedValue;
    }
  }