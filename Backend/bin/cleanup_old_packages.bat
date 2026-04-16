@echo off
echo Cleaning old com.AuctionSystem uppercase package folders...

set BASE=c:\admin\3rd year\sem6\OOAD\LAB\Project\Auction_System\Backend\src\main\java\com\AuctionSystem

if exist "%BASE%\Adapter" rd /s /q "%BASE%\Adapter" && echo Deleted Adapter
if exist "%BASE%\Builder" rd /s /q "%BASE%\Builder" && echo Deleted Builder
if exist "%BASE%\Command" rd /s /q "%BASE%\Command" && echo Deleted Command
if exist "%BASE%\Constants" rd /s /q "%BASE%\Constants" && echo Deleted Constants
if exist "%BASE%\Controllers" rd /s /q "%BASE%\Controllers" && echo Deleted Controllers
if exist "%BASE%\DTO" rd /s /q "%BASE%\DTO" && echo Deleted DTO
if exist "%BASE%\Exception" rd /s /q "%BASE%\Exception" && echo Deleted Exception
if exist "%BASE%\Facade" rd /s /q "%BASE%\Facade" && echo Deleted Facade
if exist "%BASE%\Factory" rd /s /q "%BASE%\Factory" && echo Deleted Factory
if exist "%BASE%\Model" rd /s /q "%BASE%\Model" && echo Deleted Model
if exist "%BASE%\Observer" rd /s /q "%BASE%\Observer" && echo Deleted Observer
if exist "%BASE%\Repository" rd /s /q "%BASE%\Repository" && echo Deleted Repository
if exist "%BASE%\Service" rd /s /q "%BASE%\Service" && echo Deleted Service
if exist "%BASE%\Strategy" rd /s /q "%BASE%\Strategy" && echo Deleted Strategy
if exist "%BASE%\Util" rd /s /q "%BASE%\Util" && echo Deleted Util

echo.
echo Done! Remaining folders:
dir /b "%BASE%"
echo.
echo Now run: cd /d "c:\admin\3rd year\sem6\OOAD\LAB\Project\Auction_System\Backend" ^&^& mvn compile
pause
