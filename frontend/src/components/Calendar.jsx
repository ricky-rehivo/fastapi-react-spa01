import React from "react";
import DatePicker from "react-datepicker";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";


export default function Calendar () {
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
                //events={myEvents} // 起動時に登録するイベント
                //select={handleSelect} // カレンダー範囲選択時
                //eventClick={handleClick} // イベントクリック時
          />
    );
}
