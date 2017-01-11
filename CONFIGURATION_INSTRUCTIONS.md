# Configuration Instructions
---

* #### All easily customizable variables can be found in: `src/js/configuration/app.config.js`

* #### Here is a summary of items that can be customized:

### Branding Configuration
| Variable                  | Example | Description |  
| ------------------------- | --------| ----------- |
| appName                   | DocDish | The name of the app. Used as the page title. |
| logo                      | DocDishLogo.png | The name of the file to be used as the site logo. Displayed in the header and on the home page. The file must exist in the /images folder. |
| icon                      | md.png | The name of the file to be used as the page icon. Displayed in the browser tab. The file must exist in the /images folder. |
| instructionsText          | Lorem ipsum dolor sit amet, ante ipsum vitae in vestibulum non malesuada. | Instructions for how to use the site. Displayed on the home page. |
| missionAboutText          | Lorem ipsum dolor sit amet, ante ipsum vitae in vestibulum non malesuada. | A summary of the site, including its mission and any other information about it. Displayed on the home page. |

### Google OAuth Configuration
| Variable                  | Example | Description |  
| ------------------------- | --------| ----------- |
| apiKey                    | ABcdEfGH123ijk4LM5nOPQrstuvWXy67-8ZaBCD | Generated in the Google Developer Console when creating a project to access any Google API. |
| clientId                  | 012345678901-abcde01f2ghijklmnopqr3stuv45w67x.apps.googleusercontent.com | Generated in the Google Developer Console when creating a project that uses Google OAuth. |

### API URL Configuration
| Variable                  | Example | Description |  
| ------------------------- | --------| ----------- |
| nppesSearchUrl            | http://api.docdish.com/search/api/public/nppes/pjson/pjson.json | The URL for API GET requests to search the NPPES database. |
| pecosSearchUrl            | http://api.docdish.com/search/api/public/pecos/compiled/compiled.json | The URL for API GET requests to search the PECOS database. |
| nppesUpdateUrl            | http://api.docdish.com/write/api/ip/nppes-update | The URL for API PUT requests to update the NPPES database. |
| pecosUpdateUrl            | http://api.docdish.com/write/api/ip/pecos-update | The URL for API PUT requests to update the PECOS database. |
| fhirUpdatePractitionerUrl | http://api.docdish.com/write/api/ip/update-Provider | The URL for API PUT requests to update the FHIR Provider/Practitioner database. |
