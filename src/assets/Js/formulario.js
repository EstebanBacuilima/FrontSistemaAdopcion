// for password hide and show option

let allShowHidePassword = document.querySelectorAll('.password-showHide')

allShowHidePassword.forEach(item => {
    item.addEventListener('click', ()=> {
        item.classList.toggle('hide')
        if(item.closest('.form-input').querySelector('input').type === 'password') {
            item.closest('.form-input').querySelector('input').type = 'text'
        }else {
            item.closest('.form-input').querySelector('input').type = 'password'
        }
    })
})


// for form steps
const allStepBtn = document.querySelectorAll('[tab-target]')
const allStepItem = document.querySelectorAll('.step-item')
const allTabs = document.querySelectorAll('.step-tab')
allStepBtn.forEach(item => {
    item.addEventListener('click', ()=> {
        let currentTabId = item.getAttribute('tab-target')
        let currentTab = document.getElementById(`${currentTabId}`)

        allStepItem.forEach(item => {
            item.classList.remove('active')
        })
    
        allTabs.forEach((tab,i) => {
            if(tab.id === currentTab.id) {
                for(let l = 0; i >= 0; i--) {
                    allStepItem[i].classList.add('active')
                }
                
            }
        })

        allTabs.forEach(item => {
            item.classList.remove('active')
        })

        currentTab.classList.add('active')
        item.classList.add('active')
    })
})