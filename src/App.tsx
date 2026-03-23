import { Navigate, Route, Routes } from 'react-router-dom'
import { TeacherLab } from './pages/TeacherLab'
import { TeacherAnalytics } from './pages/TeacherAnalytics'
import { TeacherSubmissions } from './pages/TeacherSubmissions'
import { StudentHome } from './pages/StudentHome'
import { StudentQA } from './pages/StudentQA'
import { StudentOJ } from './pages/StudentOJ'
import { Courseware } from './pages/Courseware'
import { Discussion } from './pages/Discussion'
import { QuestionBank } from './pages/QuestionBank'
import { KruskalExercise } from './pages/KruskalExercise'
import { PrimExercise } from './pages/PrimExercise'
import { WordCloud } from './pages/WordCloud'
import { MobileWordForm } from './pages/MobileWordForm'
import { AppLayout } from './components/AppLayout'
import KnowledgeGraph from './pages/KnowledgeGraph'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<StudentHome />} />
        <Route path="/student/knowledge-graph" element={<KnowledgeGraph />} />
        <Route path="/student/qa" element={<StudentQA />} />
        <Route path="/student/oj" element={<StudentOJ />} />
        <Route path="/student/kruskal" element={<KruskalExercise />} />
        <Route path="/student/prim" element={<PrimExercise />} />
        <Route path="/student/wordcloud" element={<WordCloud />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/courseware" element={<Courseware />} />
        <Route path="/teacher" element={<TeacherLab />} />
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
        <Route path="/teacher/submissions" element={<TeacherSubmissions />} />
        <Route path="/teacher/question-bank" element={<QuestionBank />} />
      </Route>
      
      <Route path="/mobile-submit" element={<MobileWordForm />} />
      
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  )
}

export default App
