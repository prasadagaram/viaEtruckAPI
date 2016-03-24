/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


generateRandomNumber = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
	generateRandomNumber: generateRandomNumber
};