**Goal**
The Sunlight Right web application is intended to bring health awareness to everyone by promoting the use of vitamin D via sunlight exposure or supplementation.

Features
- Tells user how much sunlight they need in order to get a determined amount of vitamin D (International Units)
  - Using Open Meteo API https://open-meteo.com/en/docs
  - Factors: skin surface area exposure, skin tone (Fitzpatrick Scale), weather (direct solar radiation watts/per square meter)
  - Research questions to find answers to:
    - how much melanin blocks solar radiation? https://pmc.ncbi.nlm.nih.gov/articles/PMC2671032/#:~:text=The%20efficacy%20of%20melanin%20as,of%20the%20skin%20against%20sunburn.
      - I-24.0%
      - II-20.6%
      - III-17.3% 
      - IV-14.0% 
      - V-10.7% 
      - VI-7.4%
    - what specific UV ray causes vitamin D production?
      - UVB which only comprises 5% of UV rays and the rest of it is UVA.
    - how much vitamin D is absorbed via supplementation?
      - only 60% is absorbed
    - how does the amount of skin exposure determine amount of solar radiation absorbed into skin?
      - hands & face: 12%
      - short sleaves: 26%
      - shorts & t-shirt: 46%
      - only shorts: 72%
      - naked: 99%
    - BMI
    - Age https://pmc.ncbi.nlm.nih.gov/articles/PMC3256341/
      - 0-21 100%
      - 22-40 83%
      - 31-59 66%
      - 60+ 49%
    - Total Human Surface area Du Bois formula
      - body surface area (m2) = 0.007184 * weight^0.425(kg) * height^0.725(cm)
    - Minimum amount of solar radiation for vitamin D production in skin
      - 0.00346 W/m2
    - VIT D FORMULA via sunlight https://www.sciencedirect.com/science/article/pii/S0048969716320307?via%3Dihub
      - refer to chart: https://docs.google.com/spreadsheets/d/10Q1NNXO7l7ZDnmvvAHUgIwdjus7XbOUkNwU1CQInJm8/edit?gid=42196605#gid=42196605
      - first get watts absorbed by multiplying the recorded radiance and total body surface area times percentage of chosen skin exposed based on the current uv index
      - second multiply watts absorbed by the Vitamin D rate to get final rate/min based on the skin type


**Finished Tasks**
- implement open-meteo to get solar radiation for the day
- implement local storage is save on API uses per session/user
- get user's location coords and timezone
- line chart to view hours and uv index for the day
- pie chart to see the greatest and least amount of vitamin D produced for each hour where production is > 0
- implement google maps with coords https://developers.google.com/maps/documentation/embed/quickstart
- Set current Vit D goal variable & determine most optimal hours w/ less time spent under sunshine
- Change page header to represent Sunlight Right Project


**Current Tasks**
- Include research and methods
  - Explain how rate of vitamin D (IU/min) was gathered and refer to article
  - Explain how skin tone, age, bsa, unilateral exposure, and exposure affect these rates
- Explain other factors that were not accounted for such as BMI
- Depict RDA of vitamin D and question adequacy and risks of too much solar radiation
- Bottom section of page should explain why this app was made
  - Vitamin D deficiency and increasing rates of chronic diseases such as cancer and cardiovascular diseases
  - Benefits of vitamin D to the human body, etc...
- Consider Sunshine Duration with UV index!!!


**Future Tasks**
- Implement Google Analytics