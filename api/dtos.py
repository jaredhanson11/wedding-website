from pydantic import BaseModel, Field

class NameLookupRequest(BaseModel):
    name: str = Field(..., description="Guest name to search for")

class NameLookupResponse(BaseModel):
    id: str = Field(..., description="Unique RSVP code")

class RSVPGuestResponse(BaseModel):
    name: str = Field(..., description="Guest name")
    yes_no: bool | None = Field(..., description="Yes or No")
    dietary_restrictions: str | None = Field(default="", description="Dietary restrictions")

class RSVPLookupResponse(BaseModel):
    guest_1: RSVPGuestResponse  = Field(description="Guest 1")
    guest_2: RSVPGuestResponse | None = Field(default=None, description="Guest 2")
    guest_3: RSVPGuestResponse | None = Field(default=None, description="Guest 3")
    guest_4: RSVPGuestResponse | None = Field(default=None, description="Guest 4")
    guest_5: RSVPGuestResponse | None = Field(default=None, description="Guest 5")
    guest_6: RSVPGuestResponse | None = Field(default=None, description="Guest 6")
    email: str | None = Field(default=None, description="Contact email")

class RSVPGuestRequest(BaseModel):
    yes_no: bool = Field(..., description="Yes or No")
    dietary_restrictions: str | None = Field(default="", description="Dietary restrictions")

class RSVPRequest(BaseModel):
    id: str = Field(..., description="Unique RSVP code")
    guest_1: RSVPGuestRequest  = Field(default=None, description="Guest 1")
    guest_2: RSVPGuestRequest | None = Field(default=None, description="Guest 2")
    guest_3: RSVPGuestRequest | None = Field(default=None, description="Guest 3")
    guest_4: RSVPGuestRequest | None = Field(default=None, description="Guest 4")
    guest_5: RSVPGuestRequest | None = Field(default=None, description="Guest 5")
    guest_6: RSVPGuestRequest | None = Field(default=None, description="Guest 6")
    email: str | None = Field(default=None, description="Contact email")