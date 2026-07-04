from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import schemas
from app.crud import application_crud

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.get("/", response_model=list[schemas.ApplicationResponse])
def get_applications(db: Session = Depends(get_db)):
    return application_crud.get_all(db)


@router.get("/{application_id}", response_model=schemas.ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    result = application_crud.get_by_id(db, application_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    return result


@router.post(
    "/",
    response_model=schemas.ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    application: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
):
    return application_crud.create(db, application)


@router.patch(
    "/{application_id}",
    response_model=schemas.ApplicationResponse,
)
def update_application(
    application_id: int,
    application: schemas.ApplicationUpdate,
    db: Session = Depends(get_db),
):
    result = application_crud.update(db, application_id, application)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    return result


@router.delete("/{application_id}", status_code=status.HTTP_200_OK)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    deleted = application_crud.delete(db, application_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    return {"message": "Deleted successfully"}