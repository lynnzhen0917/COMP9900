const birthyear = []
const birthmonth = []
const birthday = []

for (var i=1920; i<2003; i++) {
        birthyear.push(i)
    }

for (var j = 1; j < 13; j++) {
    birthmonth.push(j)
}

for (var k = 1; k < 32; k++) {
    birthday.push(k)
}

export { birthyear, birthmonth, birthday }
