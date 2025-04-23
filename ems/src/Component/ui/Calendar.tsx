// filepath: /c:/Users/2389633/Downloads/finalapp/app/ems/src/components/ui/Calendar.tsx
import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

const Calendar: React.FC = () => {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
        <div>
            <ReactCalendar
                onChange={(value) => setDate(value as Date)}
                value={date}
                minDate={new Date()} // Disable past dates
            />
            {date && <p>Selected Date: {date.toDateString()}</p>}
        </div>
    );
};

export { Calendar };