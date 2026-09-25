// Copyright (c) 2026 @crazycatlover98544

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// You may also read these terms at the following website: https://opensource.org/license/mit

// Please note that the code from getW is derived from the function "get" in GarboMuffin's (https://scratch.mit.edu/users/GarboMuffin/) "Fetch" Scratch Extension. You can access it at the following URL: https://extensions.turbowarp.org/fetch.js
// The code from this part is licensed under MIT and MPL-2.0, as stated in the code.

// All other code is licensed under the MIT license.

// My GitHub account is located at https://github.com/crazycatlover98544
// My MistWarp account is located at https://mistwarp.org/users/crazycatlover98544

// Please note that this code is not written by an expert.
// I am much better with Python, and I am pretty new to JS.
// This code is meant to run SANDBOXED inside of a Scratch extension (eg. TurboWarp).
// As stated in the MIT License, I am not liable for anything that happens if you get this wrong.

class NWSWeather {
  constructor(runtime) {
    // Non-weather stuff
    this.ip_request = {};
    this.weather_request_main = {};
    this.weather_request = {};
    this.weather_request_slim = {}
    this.forecast_website = '';
    this.assembled_string = '';
    this.latitude = 0.0;
    this.longitude = 0.0;
    this.ip = '0.0.0.0';
    this.city = 'City';
    this.state = 'State';
    this.state_short = 'ST';
    // All weather stuff
    this.start_time = '';
    this.end_time = '';
    this.isday = null;
    this.temperature = 0;
    this.temp_unit = 'F';
    this.wind_speed = '0 mph';
    this.wind_direction = 'W';
    this.icon_url = '';
    this.short_forecast = '';
    this.long_forecast = '';
  }
  getInfo() {
    return {
      id: 'nwsweather',
      name: 'Weather',
      color1: "#1b65f0",
      color2: "#1b65f0",
      color3: "#1b65f0",
      blocks: [
        {
          opcode: 'gwd',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Get Weather Data'
        },
        {
          opcode: 'url_main',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Main URL Request'
        },
        {
          opcode: 'url_forecast',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Forecast URL Request'
        },
        {
          opcode: 'url_icon',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Icon URL'
        },
        {
          opcode: 'temp',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Temperature'
        },
        {
          opcode: 'unit',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Temperature Unit'
        },
        {
          opcode: 'wind',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Wind Speed'
        },
        {
          opcode: 'winddir',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Wind Direction'
        },
        {
          opcode: 'forecast_block',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Short Forecast'
        },
        {
          opcode: 'longforecast_block',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Long Forecast'
        },
        {
          opcode: 'isday_block',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Is Daytime?'
        },
        {
          blockType: Scratch.BlockType.LABEL,
          text: 'Extras (Not related to weather)'
        },
        {
          opcode: 'ipaddr',
          blockType: Scratch.BlockType.REPORTER,
          text: 'IP Address (ISP)'
        },
        {
          opcode: 'latitude_block',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Latitude (IP)'
        },
        {
          opcode: 'longitude_block',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Longitude (IP)'
        },
        {
          opcode: 'city_name',
          blockType: Scratch.BlockType.REPORTER,
          text: 'City Name (IP)'
        },
        {
          opcode: 'state_name',
          blockType: Scratch.BlockType.REPORTER,
          text: 'State Name (IP)'
        },
        {
          opcode: 'state_short_name',
          blockType: Scratch.BlockType.REPORTER,
          text: 'State Code (IP)'
        }
      ]
    };
  }
  
  // All following code, until marked to stop, has been copied and modified from GarboMuffin's "Fetch" extension, which can be found at https://extensions.turbowarp.org/fetch.js, and is licensed under the MIT and MPL-2.0 license.
  getW(args) { 
    return Scratch.fetch(args)
      .then((r) => r.json())
      .catch(() => "");
  }
  // End of modified code from https://extensions.turbowarp.org/fetch.js by GarboMuffin.
  // All code after this is not from the "Fetch" extension by GarboMuffin.

  async gwd() {
    // Get the IP address and other information
    this.ip_request = await this.getW('https://free.freeipapi.com/api/v1/json/')
    
    // Get the approximate location
    this.latitude = this.ip_request.latitude;
    this.longitude = this.ip_request.longitude;
    this.city = this.ip_request.cityName; // I don't need these, I just put them in extras.
    this.state = this.ip_request.regionName;
    this.state_short = this.ip_request.regionCode;

    console.log(this.ip_request.latitude); // I have not bothered to remove these.
    console.log(this.ip_request.longitude);

    this.assembled_string = 'https://api.weather.gov/points/' + this.latitude + ',' + this.longitude
    this.weather_request_main = await this.getW(this.assembled_string) // Get the main NWS response
    
    console.log('%s',this.weather_request_main);
    
    this.forecast_website = this.weather_request_main.properties.forecast; // Get the forecast URL
    
    console.log('%s',this.forecast_website);
    
    this.weather_request = await this.getW(this.forecast_website); // Get JSON response for forecast
    
    this.weather_request_slim = this.weather_request.properties.periods[0]; // Isolate the current one
    
    // Get all the information
    this.start_time = this.weather_request_slim.startTime;
    this.end_time = this.weather_request_slim.endTime;
    
    this.isday = this.weather_request_slim.isDaytime;
    
    this.temperature = this.weather_request_slim.temperature;
    this.temp_unit = this.weather_request_slim.temperatureUnit;
    
    this.wind_speed = this.weather_request_slim.windSpeed;
    this.wind_direction = this.weather_request_slim.windDirection;
    
    this.icon_url = this.weather_request_slim.icon;
    
    this.short_forecast = this.weather_request_slim.shortForecast;
    this.long_forecast = this.weather_request_slim.detailedForecast;
  }

  ipaddr() {
    if (this.ip_request && Object.keys(this.ip_request).length > 0 && this.ip_request.constructor === Object) {
      this.ip = this.ip_request.ipAddress;
    } else {
      this.ip = '0.0.0.0';
    }
    return this.ip;
  }

  latitude_block() {
    return this.latitude;
  }

  longitude_block() {
    return this.longitude;
  }

  temp() {
    return this.temperature;
  }

  unit() {
    return this.temp_unit;
  }

  url_main() {
    return this.assembled_string;
  }

  url_icon() {
    return this.icon_url;
  }

  url_forecast() {
    return this.forecast_website;
  }

  isday_block() {
    return this.isday;
  }

  wind() {
    return this.wind_speed;
  }

  winddir() {
    return this.wind_direction;
  }

  city_name() {
    return this.city;
  }

  state_name() {
    return this.state;
  }

  state_short_name() {
    return this.state_short;
  }

  forecast_block() {
    return this.short_forecast;
  }

  longforecast_block() {
    return this.long_forecast;
  }
}

Scratch.extensions.register(new NWSWeather());
