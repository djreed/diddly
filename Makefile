default:
	npm install
	javascript-obfuscator client/scripts --out ./obfuscated
	sudo docker build . -t hack-the-pack