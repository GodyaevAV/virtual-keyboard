document.addEventListener("DOMContentLoaded", function(event) {
	document.head.innerHTML +=''
	document.body.innerHTML += '<div class="virtualkeyboard" />'
	document.head.innerHTML +=	'<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/GodyaevAV/virtual-keyboard@master/virtualkeyboard.css">'
	const VirtualKeyboard = new Vue({
    el: '.virtualkeyboard',
		template: `
			<div class="keyboard" id="virtualkeyboard">
				<div class="symbols">
					<template v-for="(item, index) in symbols">
						<div class="key shift" v-if="index === 8" :key="item+index" @click="backspace">Backspace</div>
						<div class="key caps" v-if="index === 8" :key="'caps'+index" @click="capsControl = !capsControl"
						:class="{btnActive: capsControl && !shift}">CapsLock</div>
						<div class="key shift" v-if="index === 17" :key="item+index" @click="shiftPress"
						:class="{btnActive: shift}">Shift</div>
						<div class="key"  :key="index" @click="put(item)">{{item}} </div>
						<div class="key space" v-if="index === symbols.length - spaceNumber" :key="item+index" @click="put()">Space</div>
						<div class="key shift lang" v-if="index === symbols.length - spaceNumber" :key="item+index+'lang'" @click="changeLanguage()"><img src="https://image.flaticon.com/icons/svg/784/784679.svg" width=16px /></div>
					</template>
				</div><div class="otherSymbols">
					<template v-for="(item, index) in otherSymbols">
						<div class="key" :key="index" @click="put(item)">{{item}}</div>
					</template>
				</div>
			</div>
		`,

		data() {
			return {
				keysStr: `qwertyuiopasdfghjklzxcvbnm`,
				keyRusStr: 'йцукенгшщзхъфывапролджэячсмитьбюё',
			  forShift: ['`1234567890-=][;/.,\\', '~!@#$%^&*()_+}{:?><|'],
			  keysArr: [],
			  shiftControl: false,
				capsControl: false,
				spaceNumber: 0,
				language: false,
				password: '',
				createdElement: '',
			  sortControl: 0,
				outputArr: [],
				langControl: true
			}
		},

		methods: {



			changeLanguage() {				
				if(this.language) {
					this.sortForShift(this.forShift)
					this.sortKeys(this.createKeysArray(this.createArray(this.keyRusStr)))
					this.spaceNumber = 2
				} else {
					this.sortForShift(this.forShift)
					this.sortKeys(this.createKeysArray(this.createArray(this.keysStr)))
					this.spaceNumber = 1
				}
				this.langControl = false
				this.language = !this.language
			},
			backspace () {
				this.password = this.password.substring(0, this.password.length - 1)
				this.createdElement.value = this.password
			},

			shiftPress () {
			  this.shiftControl = !this.shiftControl
			  this.capsControl = !this.capsControl
			},

			put (symbol) {
			  symbol ? this.password += symbol : this.password += ' '
			  this.capsControl = this.shiftControl ?  !this.capsControl : this.capsControl
				this.shiftControl = false
				this.createdElement.value = this.password
				
			},

			createArray: function (str) {
			  let keysArr = new Array(str.length)
			  for (let i = 0; i < str.length; i++) {
					keysArr[i] = str[i]
			  }
			  return keysArr
			},

			createKeysArray: function () {
			  let arr = new Array(...arguments)
			  let newArr = []
			  arr.map(item => {
				item.map(elem => {
				  newArr.push(elem)
				})
			  })
			  return newArr
			},

			upperCase (arr) {
			  if (this.capsControl) {
				for (let i = 0; i < arr.length; i++) {
				  arr[i] = arr[i].toUpperCase()
				}
			  } else {
				for (let i = 0; i < arr.length; i++) {
				  arr[i] = arr[i].toLowerCase()
				}
			  }
			  return arr
			},

			sortKeys (arr) {
			  let newArr = []
			  while (arr.length) {
				let rand = 0 + Math.floor(Math.random(new Date().toISOString()) * (arr.length))
				newArr.push(arr[rand])
				arr.splice(rand, 1)
			  }
			  this.sortControl++
			  this.keysArr = newArr
			},

			sortForShift (elem) {
				if(this.langControl) {
					let arr = elem
					let newArr = [[], []]
					while (arr[0].length) {
						let rand = 0 + Math.floor(Math.random(new Date().toISOString()) * (arr[0].length))
						for (let i = 0; i <= 1; i++) {
							newArr[i].push(arr[i][rand])
							arr[i] = arr[i].substr(0, rand) + arr[i].substr(rand + 1, arr[i].length)
						}
					}
					this.outputArr = newArr
				}
			}
		},
		computed: {
			shift () {
			  return this.shiftControl ? 1 : 0
			},

			symbols () {
			  return this.upperCase(this.keysArr)
			},

			otherSymbols () {
			  return this.outputArr[this.shift]
			}
		},
		mounted () {
			this.changeLanguage()
			this.createdElement = document.querySelector('.password')
			this.createdElement.disabled = true
		}
	});
	var vkb = document.getElementById('virtualkeyboard');

	vkb.onmousedown = function(e) {
		if (e.path[1].id) {
		
			var coords = getCoords(vkb);
			var shiftX = e.pageX - coords.left;
			var shiftY = e.pageY - coords.top;
		
			vkb.style.position = 'absolute';
			document.body.appendChild(vkb);
			moveAt(e);
		
			vkb.style.zIndex = 1000;
		
			function moveAt(e) {
				vkb.style.left = e.pageX - shiftX + 'px';
				vkb.style.top = e.pageY - shiftY + 'px';
			}
		
			document.onmousemove = function(e) {
				moveAt(e);
			};
		
			vkb.onmouseup = function() {
				document.onmousemove = null;
				vkb.onmouseup = null;
			};
		
		}
		
		vkb.ondragstart = function() {
			return false;
		};
		
		function getCoords(elem) {
			var box = elem.getBoundingClientRect();
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};
		}
	}
});
