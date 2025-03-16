<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Date Difference Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
        }

        .container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
            width: 300px;
        }

        label {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
            color: #333;
        }

        textarea {
            width: 100%;
            height: 60px;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
        }

        input[type="date"] {
            padding: 10px;
            font-size: 14px;
            border: 2px solid #007bff;
            border-radius: 5px;
            outline: none;
            cursor: pointer;
            display: none;
            transition: all 0.3s ease-in-out;
            width: 100%;
        }

        /* Hide the clear (X) button in Chrome & Edge */
        input[type="date"]::-webkit-clear-button,
        input[type="date"]::-webkit-inner-spin-button {
            display: none;
        }

        input[type="date"]:hover,
        input[type="date"]:focus {
            border-color: #0056b3;
            box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
        }

        button {
            margin-top: 15px;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        #result {
            margin-top: 15px;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <div class="container">
        <label for="textarea">Enter Text:</label>
        <textarea id="textarea" placeholder="Write something..."></textarea>

        <div class="checkbox-container">
            <input type="checkbox" id="toggleDate" onchange="toggleDatePicker()">
            <label for="toggleDate">Change Date</label>
        </div>

        <input type="date" id="datepicker">
        <button onclick="calculateDifference()">Submit</button>
        <div id="result"></div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("datepicker").value = new Date().toISOString().split('T')[0];
        });

        function toggleDatePicker() {
            const datepicker = document.getElementById("datepicker");
            datepicker.style.display = document.getElementById("toggleDate").checked ? "block" : "none";
        }

        function calculateDifference() {
            const selectedDate = new Date(document.getElementById("datepicker").value);
            const currentDate = new Date();

            document.getElementById("result").innerHTML = `
            Selected Date: ${selectedDate.toISOString().split('T')[0]} <br>
            Today Date: ${currentDate.toISOString().split('T')[0]} <br>
            Difference: ${Math.floor((selectedDate - currentDate) / (1000 * 60 * 60 * 24)) + 1} days`;
        }
    </script>

</body>
</html>
