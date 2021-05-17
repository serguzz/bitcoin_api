
  fetchBitcoinData();

  function fetchBitcoinData() {

      // here we fetch bitcoin rate data of the last week from the public Api
      fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start=2021-05-10&end=2021-05-16')
        .then(function(resp) {  return resp.json()
              }) // Convert data to json
          .then(function (data) {
              // data - is Json format of bitcoin rate of the last week

              // here we store data to an array and process it to predict next week values
              let weekData = Object.values(data.bpi);
              console.log(weekData);

              // prediction method is simple: it calculates next day value according to the past five days
              // values with relative weight (more recent value has greater weight)
              for (var i = 0; i < 7; i++) {
                  weekData[ 7 + i ] = 0.4*weekData[ 6 + i ] + 0.25*weekData[5+i]
                                      + 0.15*weekData[4+i]+ 0.1*weekData[3+i]
                                        + 0.1*weekData[2+i];

                }

              console.log(weekData);

              // now visualize data on the chart
              let canvas = document.getElementById('canvas');
              let ctx = canvas.getContext('2d');

              ctx.fillStyle = "black"; // black lines
              ctx.lineWidth = 2.0; // line width
              ctx.beginPath(); // init path
              ctx.moveTo(30, 10); // initial point
              ctx.lineTo(30, 460); // move point to
              ctx.lineTo(1000, 460); // move line to
              ctx.stroke(); //draw canvas


              ctx.fillStyle = "black"; // color - black
              // making Y scale labels
              for(let i = 0; i < 10; i++) {
                  ctx.fillText((8 - i) * 4 + 40 + "k", 4, i * 50 + 60);
                  ctx.beginPath();
                  ctx.moveTo(25, i * 50 + 60);
                  ctx.lineTo(30, i * 50 + 60);
                  ctx.stroke();
              }

              // X scale - days of the two weeks- last week to next week, total - 14
              let labels = ["-7", "-6", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6"];

              // draw the X scale labels
              for(var i=0; i<14; i++) {
                  ctx.fillText(labels[i], 50+ i*60, 475);
              }

              ctx.fillStyle = "green"; // green color for the chart
              // draw the chart
              for(var i=0; i<weekData.length; i++) {
                  var dp = 2*(weekData[i]/1000-40);
                  ctx.fillRect(40 + i*60, 420-dp*5 , 50, dp*5+40);
              }
            })
      .catch(function() {
        // catch any errors
      });
  }
