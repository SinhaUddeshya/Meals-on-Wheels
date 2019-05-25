#This is a script for backing up our MySQL database every time the script is run 

cd /home/mow/IN602-Meals-On-Wheels/app/backups #change directory into the backup folder

date="$(date "+%Y-%m-%d_%H-%M")" #getting the current date/time to append to the File Name of the database export

mysqldump -u root -ptoor --databases mealsonwheels --ignore-table=mealsonwheels.addresses > mealsonswheels-"$date".sql #exporting the database, excluding the 'addresses' table to a file with timestamp