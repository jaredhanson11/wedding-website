# Load environment variables
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sheets import SheetsServiceDependency
from dtos import (
    NameLookupRequest,
    NameLookupResponse,
    RSVPLookupResponse,
    RSVPGuestResponse,
    RSVPRequest,
)

load_dotenv()

app = FastAPI(title="Wedding API", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "wedding-api", "version": "0.1.0"}


@app.post("/codes", response_model=NameLookupResponse)
def lookup_guest(request: NameLookupRequest, sheets_service: SheetsServiceDependency):
    """
    Look up a guest by name and return their RSVP code.
    """
    try:
        row = sheets_service.get_row_by_name(request.name)

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Guest not found. Please check the spelling or contact us.",
            )

        return NameLookupResponse(id=row.id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error looking up guest: {str(e)}")


@app.get("/rsvps/{rsvp_id}", response_model=RSVPLookupResponse)
def get_rsvp(rsvp_id: str, sheets_service: SheetsServiceDependency):
    """
    Get existing RSVP data by RSVP ID.
    """
    try:
        row = sheets_service.get_row_by_id(rsvp_id)

        if not row or not row.guest_1:
            raise HTTPException(
                status_code=404, detail="RSVP not found. Please verify your code."
            )

        return RSVPLookupResponse(
            email=row.email,
            guest_1=RSVPGuestResponse(
                name=row.guest_1.name,
                yes_no=row.guest_1.yes_no,
                dietary_restrictions=row.guest_1.dietary_restrictions,
            ),
            guest_2=RSVPGuestResponse(
                name=row.guest_2.name,
                yes_no=row.guest_2.yes_no,
                dietary_restrictions=row.guest_2.dietary_restrictions,
            )
            if row.guest_2
            else None,
            guest_3=RSVPGuestResponse(
                name=row.guest_3.name,
                yes_no=row.guest_3.yes_no,
                dietary_restrictions=row.guest_3.dietary_restrictions,
            )
            if row.guest_3
            else None,
            guest_4=RSVPGuestResponse(
                name=row.guest_4.name,
                yes_no=row.guest_4.yes_no,
                dietary_restrictions=row.guest_4.dietary_restrictions,
            )
            if row.guest_4
            else None,
            guest_5=RSVPGuestResponse(
                name=row.guest_5.name,
                yes_no=row.guest_5.yes_no,
                dietary_restrictions=row.guest_5.dietary_restrictions,
            )
            if row.guest_5
            else None,
            guest_6=RSVPGuestResponse(
                name=row.guest_6.name,
                yes_no=row.guest_6.yes_no,
                dietary_restrictions=row.guest_6.dietary_restrictions,
            )
            if row.guest_6
            else None,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving RSVP: {str(e)}")


@app.put("/rsvps")
def submit_rsvp(request: RSVPRequest, sheets_service: SheetsServiceDependency):
    """
    Submit or update RSVP data.
    """
    try:
        # Verify the ID exists
        existing_row = sheets_service.get_row_by_id(request.id)
        if not existing_row:
            raise HTTPException(
                status_code=404,
                detail="Invalid RSVP code. Please look up your name again.",
            )

        # Update the sheet
        success = sheets_service.update_row_by_id(
            request.id, guest_updates, request.email
        )

        if not success:
            raise HTTPException(
                status_code=500, detail="Failed to save RSVP. Please try again."
            )

        return {"success": True, "message": "Thank you! Your RSVP has been saved."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting RSVP: {str(e)}")
