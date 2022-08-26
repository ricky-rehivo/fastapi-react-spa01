import React from "react";
import DatePicker from "react-datepicker";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";


const Calendar = () => {
    let myEvents = [
        {
            id: 0,
            title: "event 1",
            start: "2020-05-22 10:00:00",
            end: "2020-05-22 11:00:00",
            memo: "memo1"
        },
        {
            id: 1,
            title: "event 2",
            start: "2020-05-23 10:00:00",
            end: "2020-05-23 11:00:00",
            memo: "memo2"
        }
    ];

    const renderForm = () => {
        return (
            <div
                className={
                    this.state.formInview ? "container__form inview" : "container__form"
                }
            >
                <form>
                    {this.state.isChange  ? (
                        <div className="container__form__header">予定を変更</div>
                    ) : (
                        <div className="container__form__header">予定を入力</div>
                    )}
                    <div>{this.renderTitle()}</div>
                    <div>{this.renderStartTime()}</div>
                    <div>{this.renderEndTime()}</div>
                    <div>{this.renderMemo()}</div>
                    <div>{this.renderBtn()}</div>
                </form>
            </div>
        );
    }


    const renderTitle = () => {
        return (
            <React.Fragment>
                <p className="container__form__label">タイトル</p>
                <input
                    className="container__form__title"
                    type="text"
                    value={this.state.inputTitle}
                    onChange={(e) => {
                    this.setState({ inputTitle: e.target.value });

                    if (e.target.value === "") {
                        this.setState({ isInputTitle: false });
                    } else {
                        this.setState({ isInputTitle: true });
                    }
                    }}
                />
            </React.Fragment>
        );
    }

    const renderMemo = () => {
        return (
            <React.Fragment>
            <p className="container__form__label">メモ</p>
            <textarea
                className="container__form__memo"
                rows="3"
                value={this.state.inputMemo}
                onChange={(e) => {
                this.setState({ inputMemo: e.target.value });
                }}
            />
            </React.Fragment>
        );
    }

    const renderStartTime = () => {
        return (
            <React.Fragment>
                <p className="container__form__label">開始日時</p>
                <DatePicker
                    className="container__form__datetime"
                    locale="ja"
                    dateFormat="yyyy/MM/d HH:mm"
                    selected={this.state.inputStart}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    todayButton="today"
                    onChange={(time) => {
                    this.setState({ inputStart: time });
                    }}
                />
            </React.Fragment>
        );
    }
    const renderEndTime = () => {
        return (
        <React.Fragment>
            <p className="container__form__label">終了日時</p>
            <DatePicker
                className="container__form__datetime"
                locale="ja"
                dateFormat="yyyy/MM/d HH:mm"
                selected={this.state.inputEnd}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                todayButton="today"
                onChange={(time) => {
                    this.setState({ inputEnd: time });
                }}
            />
        </React.Fragment>
        );
    }

    const renderBtn = () => {
        return (
            <div>
                {!this.state.isChange ? (
                    <div>
                        <input
                            className="container__form__btn_cancel"
                            type="button"
                            value="キャンセル"
                            onClick={() => {
                            this.setState({ formInview: false });
                            }}
                        />
                        <input
                            className="container__form__btn_save"
                            type="button"
                            value="保存"
                            disabled={!this.state.isInputTitle}
                            onClick={this.onAddEvent}
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            className="container__form__btn_delete"
                            type="button"
                            value="削除"
                            onClick={this.onDeleteEvent}
                        />
                        <input
                            className="container__form__btn_save"
                            type="button"
                            value="変更"
                            onClick={this.onChangeEvent}
                        />
                    </div>
                )}
            </div>
        );
    }

    const handleSelect = (selectInfo) => {
        let start = new Date(selectInfo.start);
        let end = new Date(selectInfo.end);
        start.setHours(start.getHours());
        end.setHours(end.getHours());
    
        this.setState({ inputTitle: "" });
        this.setState({ inputMemo: "" });
        this.setState({ isInputTitle: false });
        this.setState({ inputStart: start });
        this.setState({ inputEnd: end });
        this.setState({ isChange: false });
        this.setState({ formInview: true });
    };

    const handleClick = (info) => {
        this.selEventID = info.event.id;
        const selEvent = this.myEvents[info.event.id];
        const title = selEvent.title;
        const memo = selEvent.memo;
        const start = new Date(selEvent.start);
        const end = new Date(selEvent.end);

        this.setState({ inputTitle: title });
        this.setState({ inputMemo: memo });
        this.setState({ isInputTitle: true });
        this.setState({ inputStart: start });
        this.setState({ inputEnd: end });
        this.setState({ isChange: true });
        this.setState({ formInview: true });
    };

    const onAddEvent = () => {
        const starttime = this.changeDateToString(this.state.inputStart);
        const endtime = this.changeDateToString(this.state.inputEnd);
    
        if (starttime >= endtime) {
            alert("開始時間と終了時間を確認してください。");
            return;
        }
        const event = {
            title: this.state.inputTitle,
            memo: this.state.inputMemo,
            start: starttime,
            end: endtime,
        };
        if (this.addEvent(event) === true) {
            window.alert("設定しました");
            this.setState({ formInview: false });
        }
    }

    const addEvent = (ev) => {
        ev.id = this.getID();
        this.myEvents.push(ev);
        this.ref.current.getApi().addEvent(ev);
        return true;
    };

    const sortEventID = (a, b) => {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    };

    const getID = () => {
        this.myEvents.sort(this.sortEventID);
        let i;
        for (i = 0; i < this.myEvents.length; i++) {
            if (this.myEvents[i].id !== i) {
                break;
            }
        }
        return i;
    };

    const changeDateToString = (dt) => {
        const year = dt.getFullYear();
        const month = this.getdoubleDigestNumer(dt.getMonth() + 1);
        const date = this.getdoubleDigestNumer(dt.getDate());
        const hour = this.getdoubleDigestNumer(dt.getHours());
        const minutes = this.getdoubleDigestNumer(dt.getMinutes());
    
        const retDate = `${year}-${month}-${date} ${hour}:${minutes}:00`;
        return retDate;
      }
    const getdoubleDigestNumer = (number) => {
        return ("0" + number).slice(-2);
    }

    const onChangeEvent = (values) => {
        if (window.confirm("変更しますか？")) {
            const starttime = this.changeDateToString(this.state.inputStart);
            const endtime = this.changeDateToString(this.state.inputEnd);
    
            if (starttime >= endtime) {
                alert("開始時間と終了時間を確認してください。");
                return;
            }
    
            const event = {
                title: this.state.inputTitle,
                memo: this.state.inputMemo,
                start: starttime,
                end: endtime,
                id: this.selEventID,
            };
            if (this.changeEvent(event) === true) {
                window.alert("イベントを変更しました。");
                this.setState({ formInview: false });
            }
        } else {
          return;
        }
    }

    const changeEvent = (ev) => {
        this.myEvents[ev.id].title = ev.title;
        this.myEvents[ev.id].memo = ev.memo;
        this.myEvents[ev.id].start = ev.start;
        this.myEvents[ev.id].end = ev.end;
    
        this.ref.current.getApi().getEventById(ev.id).remove();
        this.ref.current.getApi().addEvent(this.myEvents[ev.id]);
    
        return true;
    };

    const onDeleteEvent = () => {
        if (window.confirm("削除しますか？")) {
            if (this.selEventID < this.EVENT_SEL_NON) {
                let EventID = this.selEventID;
                let delevent = this.ref.current.getApi().getEventById(EventID);
                delevent.remove();
                this.selEventID = this.EVENT_SEL_NON;
                this.myEvents[EventID].isDel = true;
            }
            this.setState({ formInview: false });
            alert("イベントを削除しました。");
        } else {
            return;
        }
    }

    return (
        <FullCalendar
                locale="ja" // 日本語
                defaultView="timeGridWeek" // 基本UI
                slotDuration="00:30:00" // 表示する時間軸の最小値
                selectable={true} // 日付選択可能
                allDaySlot={false} // alldayの表示設定
                titleFormat={{
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }} // タイトルに年月日を表示
                header={{
                    left: "prev,next,today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: "0:00",
                    endTime: "24:00",
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                //ref={ref}
                weekends={true} // 週末表示
                events={myEvents} // 起動時に登録するイベント
                select={handleSelect} // カレンダー範囲選択時
                eventClick={handleClick} // イベントクリック時
          />
    );
}

export default Calendar;