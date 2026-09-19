from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.cases import router as cases_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.actions import router as actions_router
from app.api.v1.evaluations import router as evaluations_router
from app.api.v1.websockets import router as ws_router
from app.api.v1.admin import router as admin_router
from app.api.v1.faculty import router as faculty_router
from app.api.v1.examination import router as examination_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(cases_router)
api_v1_router.include_router(sessions_router)
api_v1_router.include_router(actions_router)
api_v1_router.include_router(evaluations_router)
api_v1_router.include_router(ws_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(faculty_router)
api_v1_router.include_router(examination_router)
