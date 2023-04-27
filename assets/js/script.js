const convert = document.querySelector('#converter')
//PupJKKJvcpMhXgj8HaM4DASkDmlrmR9Q
let conversStorage = JSON.parse(
    window.localStorage.getItem("conversStorage") || "[]"
);

convert.addEventListener('click', (e) => {
    e.preventDefault()
    let monto = document.getElementById('monto').value
    const divisao = document.getElementById('divisa-origen').value
    const divisad = document.getElementById('divisa-destino').value

    if (!monto) return alert('Ingrese un monto')
    monto = parseFloat(monto)
    if (isNaN(monto)) return alert('Ingrese un monto valido')
    if (divisao === divisad) return alert('Las divisas tienen que ser diferentes');

    var myHeaders = new Headers();
    myHeaders.append("apikey", "PupJKKJvcpMhXgj8HaM4DASkDmlrmR9Q");

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    fetch(`https://api.apilayer.com/fixer/convert?to=${encodeURI(divisad)}&from=${encodeURI(divisao)}&amount=${encodeURI(monto)}`, requestOptions)
      .then(response => response.json())
      .then(result => add(result))
      .catch(error => console.log('error', error));

})

const add = (res) => {
    const convers = {id: create_UUID(), value: res}

    conversStorage.push({...convers})
    window.localStorage.setItem("conversStorage", JSON.stringify(conversStorage));
    const fragment = addConver(res)
    document.querySelector('.conver').removeChild(document.querySelector('.conver').lastChild)
    document.querySelector('.conver').appendChild(fragment)
    document.querySelector('.hist').appendChild(fragment)
}

const addConver = (res) => {
    const fragment = document.createDocumentFragment()
    const article = document.createElement('article')

    const pMonto = createP({
        text: `${res.query.amount} ${res.query.from} = ${res.result} ${res.query.to}`,
        classP: ['text-2xl']
    })
    const divMonto = createDiv({
        classDiv: ['mt-4'],
        children: [pMonto]
    })
    article.appendChild(divMonto)

    fragment.appendChild(article)
    return fragment
}

const createDiv = ({ classDiv, children }) => {
    const div = document.createElement("div");
    div.classList.add(...classDiv);
  
    children.forEach((child) => {
      div.appendChild(child);
    });
  
    return div;
};
const createP = ({ text, child, classP }) => {
  const parrafo = document.createElement("p");
  if (classP) {
    parrafo.classList.add(...classP);
  }
  if (child) {
    parrafo.appendChild(child);
  }

  if (text) {
    text = document.createTextNode(text);
    parrafo.appendChild(text);
  }

  return parrafo;
};

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
}

conversStorage.forEach((e) => {
    const conver = addConver(e.value)
    document.querySelector('.hist').appendChild(conver)
})