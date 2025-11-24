import React, { useState } from 'react';
import PersonalHomeTemplate from './templates/PersonalHomeTemplate';
import TaskManagerTemplate from './templates/TaskManagerTemplate';
import ProjectTrackerTemplate from './templates/ProjectTrackerTemplate';
import MeetingNotesTemplate from './templates/MeetingNotesTemplate';
import HabitTrackerTemplate from './templates/HabitTrackerTemplate';
import ContentCalendarTemplate from './templates/ContentCalendarTemplate';
import CRMTemplate from './templates/CrmTemplate';
import WeeklyPlannerTemplate from './templates/WeeklyPlannerTemplate';
import BookNotesTemplate from './templates/BookNotesTemplate';
import TeamWikiTemplate from './templates/TeamWikiTemplate';
import BudgetTrackerTemplate from './templates/BudgetTrackerTemplate';
import EventPlanningTemplate from './templates/EventPlanningTemplate';

const TemplateManager = ({ activeTemplate, setView }) => {
    const [userTemplates, setUserTemplates] = useState([]);

    // Render the active template
    if (activeTemplate) {
        const templateProps = {
            setView: setView,
            onSave: (templateData) => {
                setUserTemplates([...userTemplates, templateData]);
                setView();
            }
        };

        switch (activeTemplate) {
            case 'personal-home':
                return <PersonalHomeTemplate {...templateProps} />;
            case 'task-manager':
                return <TaskManagerTemplate {...templateProps} />;
            case 'project-tracker':
                return <ProjectTrackerTemplate {...templateProps} />;
            case 'meeting-notes':
                return <MeetingNotesTemplate {...templateProps} />;
            case 'habit-tracker':
                return <HabitTrackerTemplate {...templateProps} />;
            case 'content-calendar':
                return <ContentCalendarTemplate {...templateProps} />;
            case 'crm':
                return <CRMTemplate {...templateProps} />;
            case 'weekly-planner':
                return <WeeklyPlannerTemplate {...templateProps} />;
            case 'book-notes':
                return <BookNotesTemplate {...templateProps} />;
            case 'team-wiki':
                return <TeamWikiTemplate {...templateProps} />;
            case 'budget-tracker':
                return <BudgetTrackerTemplate {...templateProps} />;
            case 'event-planning':
                return <EventPlanningTemplate {...templateProps} />;
            default:
                return null;
        }
    }

    return null;
};

export default TemplateManager;