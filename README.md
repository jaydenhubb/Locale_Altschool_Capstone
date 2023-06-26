# Locale_Altschool_Capstone

This API shows you all of Nigeria’s regions, states, and local government areas(LGAs). All you need to do is to pass your request into the query parameter along with you api-key which will be assigned to you upon registration.

# Technology used
* Node and express js
* Mongodb
* Redis
* Stoplight studio (For documentaion)


# Usage
1. Send a POST request with a valid email and password to the [sign up](https://localeapl.onrender.com/api/users/signup/) route using api testing tools like POSTMAN or Insomnia. ![Screenshot 2023-06-26 015047](https://github.com/jaydenhubb/Locale_Altschool_Capstone/assets/87452051/b9fecdf3-e48c-4b49-89f0-9128b18c13e5) This will receive a response containing an api key. Save this key securely because it will not be accessible after 30minutes.
   
2. Send a GET request to the [data](https://localeapl.onrender.com/api/data/getInfo) route attaching your apikey and what data you want in the query parameter. Example below
![Screenshot 2023-06-26 020441](https://github.com/jaydenhubb/Locale_Altschool_Capstone/assets/87452051/a8816d11-fde2-4002-941f-5e5a989971fa)
Notice the query param 'state=lagos' in the image above. In this API, you can either serach for state, region or local government area(lgas) individually and not together. Each request must also have the apikey query parameter as this authenticates the user.
* Searching for region
![Screenshot 2023-06-26 021235](https://github.com/jaydenhubb/Locale_Altschool_Capstone/assets/87452051/63e534b3-671e-49bc-b158-5e63659e9d03)
* Searching for local government area
  ![Screenshot 2023-06-26 021308](https://github.com/jaydenhubb/Locale_Altschool_Capstone/assets/87452051/fa1b31b6-f81d-41b1-a34c-b676317ef7e5)


