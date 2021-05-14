# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Elena Gazzarrini| 335058|
|Guillaume Augustoni |314052 |
| | |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

### Crime

The main dataset is the [crime dataset](https://www.data.gouv.fr/fr/datasets/chiffres-departementaux-mensuels-relatifs-aux-crimes-et-delits-enregistres-par-les-services-de-police-et-de-gendarmerie-depuis-janvier-1996/) it contains number of mensual crimes reported to the police per departement for 106 categories of crime(examples include "Règlements de compte entre malfaireurs", "Infractions à la législation sur les chèques", and "Autres délits économiques et financiers"). For simplification purposes two strategies are considered either grouping the 106 categories into fewer more general categories or just adding all different categories of crime into one crime indicator. 



This dataset includes data on crime back to 1996 for most departments however, for overseas France some years are missing. This website will focus on mainland France as overseas France has unique circumstances which will biais te data. Linear models will use crime data from 2017 as most of the other indicators come from the years 2016-2017. Data is mensual but has been grouped by year by us for easier analysis. 


The data is in the form of an excel spreadsheet with one sheet per departement, this form of data is being transformed to a more usable csv format.


![Crime 1996](Data/france_crime1996.png "Crime in 1996")


### Population

The crime dataset and other datasets are not adjusted for population as such a [population dataset](https://www.insee.fr/fr/statistiques/2012713) is needed. This dataset does not contain the population for every year but does have the year 2017 which will be the one used in this project. Data is at a departmental level.


### Schooling


As an bad approximation for school success in an departement we will be using the [percentage of success at the BAC](https://www.insee.fr/fr/statistiques/2012792) a french national exam. Data is from 2019 and is per departement.


### Unemployement


[Unemployement percentage](https://www.insee.fr/fr/statistiques/2134411) is available at a departemental level for the year 2019.


### Immigration

[Immigration data](https://www.insee.fr/fr/statistiques/2012727) is available for the year 2017. It contains the percentage of immigrants in each departement, plus the percentage of each nationality if further analysis is desired.


###  Poverty

[Poverty rate](https://www.insee.fr/fr/statistiques/2012803) is here. The data is by age.


 


Maps come from [france geojson](https://github.com/gregoiredavid/france-geojson)


### Problematic

Crime is a huge political subject in France. Its causes are also subject of intense political debate.
Different factors going from immigration to poverty have been proposed, but evidence seems to be lacking in the political debate. 


This project tries to show the impact of different factors at the departemental level using linear models. An interactive map will be made allowing the user to select the factors and see their impact on crime.


### Exploratory Data Analysis


See the jupyter notebooks
### Related work

Maps showing the crime rate per departement are common, and are often shown next to maps of immigration rates per departement. However this analysis is flawed as it does not take into account third factors which this project tries to fix. This project is heavily inspired by [this paper](https://www.tandfonline.com/doi/full/10.1080/13504850701578892?scroll=top&needAccess=true). 
## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

