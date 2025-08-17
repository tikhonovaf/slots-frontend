const status = {
    draft: 1,//"Черновик",
    planned: 2,//"Запланирована",
    finished: 4,// "Завершена",
    inProgress: 3,// "В процессе",
    error: 6,//"Ошибка",
    stopped: 7,//"Остановлена",
    canceled: 8,//"Отменена",
    paused: 5,//"Пауза",
    cbtManualSwitch: 10,//"CBT переключение",
    cbtSync: 9,//"CBT синхронизация",

    finishedPartly: 0,// "Завершена частично",
    startInProgress: 99,// "В процессе запуска",
};


export default status;
