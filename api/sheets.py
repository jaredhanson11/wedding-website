"""Google Sheets integration for RSVP management."""
from collections.abc import Generator
import os
from typing import Annotated, Optional, Dict, Any
from dataclasses import dataclass
from fastapi import Depends
import gspread
from google.oauth2.service_account import Credentials


@dataclass
class Guest:
    """Represents a single guest in the RSVP."""
    name: str
    yes_no: Optional[bool]
    dietary_restrictions: Optional[str]


class Row:
    """Represents a row in the Google Sheet."""
    
    def __init__(self, row_data: Dict[str, Any]):
        """Initialize from sheet row data."""
        self.id = str(row_data.get('id', ''))
        self.email = row_data.get('Email', '')
        self.sent_email: bool = row_data.get('Sent Email', False) == "no"
        
        # Parse each guest individually (up to 6)
        self.guest_1 = self._parse_guest(row_data, 1)
        self.guest_2 = self._parse_guest(row_data, 2)
        self.guest_3 = self._parse_guest(row_data, 3)
        self.guest_4 = self._parse_guest(row_data, 4)
        self.guest_5 = self._parse_guest(row_data, 5)
        self.guest_6 = self._parse_guest(row_data, 6)
    
    def _parse_guest(self, row_data: Dict[str, Any], guest_num: int) -> Guest | None:
        """Parse a single guest from row data."""
        name = row_data.get(f'Name {guest_num}')
        if not name:
            return None
        
        yes_no_val = row_data.get(f'{guest_num} Yes/No', '')
        # Convert string Yes/No to boolean
        if yes_no_val:
            yes_no = yes_no_val.lower() == 'yes' if isinstance(yes_no_val, str) else bool(yes_no_val)
        else:
            yes_no = None
        
        dietary = row_data.get(f'{guest_num} Dietary Restrictions', '')
        
        return Guest(
            name=name,
            yes_no=yes_no,
            dietary_restrictions=dietary if dietary else None
        )
    

class SheetsService:
    """Service for interacting with Google Sheets RSVP data."""
    
    def __init__(self):
        """Initialize Google Sheets client."""
        # Define the scopes
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        # Load credentials from service account file
        creds_file = os.getenv('GOOGLE_SHEETS_CREDENTIALS', 'credentials.json')
        creds = Credentials.from_service_account_file(creds_file, scopes=scopes)
        
        # Initialize gspread client
        self.client = gspread.auth.authorize(creds)
        
        # Get the spreadsheet
        sheet_id = os.getenv('GOOGLE_SHEETS_ID')
        if not sheet_id:
            raise ValueError("GOOGLE_SHEETS_ID environment variable not set")
        
        self.spreadsheet = self.client.open_by_key(sheet_id)
        self.worksheet = self.spreadsheet.sheet1  # Use first sheet
    
    def get_row_by_name(self, name: str) -> Optional[Row]:
        """
        Find row by searching for name in Name 1-6 columns.
        Returns Row object if found.
        """
        name_lower = name.lower().strip()
        
        # Get all records as list of dicts
        all_records = self.worksheet.get_all_records()
        
        # Search through Name 1-6 columns
        for record in all_records:
            for i in range(1, 7):
                guest_name = str(record.get(f'Name {i}', '')).lower().strip()
                if guest_name and name_lower in guest_name:
                    return Row(record)
        
        return None
    
    def get_row_by_id(self, rsvp_id: str) -> Optional[Row]:
        """
        Get RSVP data by ID.
        Returns Row object if found.
        """
        try:
            # Find the cell with matching ID in column 1
            cell = self.worksheet.find(rsvp_id, in_column=1)
            if not cell:
                return None
            
            # Get the entire row
            row_values = self.worksheet.row_values(cell.row)
            headers = self.worksheet.row_values(1)
            
            # Convert to dictionary
            row_dict = dict(zip(headers, row_values))
            return Row(row_dict)
        except gspread.exceptions.GSpreadException:
            return None
    
    def update_row_by_id(self, rsvp_id: str, row: Row, email: Optional[str] = None) -> bool:
        """
        Update RSVP information for a given ID.
        
        Args:
            rsvp_id: The unique ID for the RSVP
            guest_updates: List of dicts with 'yes_no' and 'dietary_restrictions'
            email: Optional email to update
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Find the row with matching ID
            cell = self.worksheet.find(rsvp_id, in_column=1)
            if not cell:
                return False
            
            row_num = cell.row
            headers = self.worksheet.row_values(1)
            
            # Build batch update list
            updates = []
            
            # Update each guest's response
            for i, guest_data in enumerate(guest_updates, start=1):
                if i > 6:  # Max 6 guests
                    break
                
                # Update Yes/No column
                yes_no_col_name = f'{i} Yes/No'
                if yes_no_col_name in headers and 'yes_no' in guest_data:
                    col_index = headers.index(yes_no_col_name) + 1
                    yes_no_value = 'Yes' if guest_data['yes_no'] else 'No'
                    updates.append({
                        'range': gspread.utils.rowcol_to_a1(row_num, col_index),
                        'values': [[yes_no_value]]
                    })
                
                # Update Dietary Restrictions column
                dietary_col_name = f'{i} Dietary Restrictions'
                if dietary_col_name in headers and 'dietary_restrictions' in guest_data:
                    col_index = headers.index(dietary_col_name) + 1
                    dietary_value = guest_data['dietary_restrictions'] or ''
                    updates.append({
                        'range': gspread.utils.rowcol_to_a1(row_num, col_index),
                        'values': [[dietary_value]]
                    })
            
            # Update email if provided
            if email and 'Email' in headers:
                col_index = headers.index('Email') + 1
                updates.append({
                    'range': gspread.utils.rowcol_to_a1(row_num, col_index),
                    'values': [[email]]
                })
            
            # Batch update all cells
            if updates:
                self.worksheet.batch_update(updates)
            
            return True
        except Exception as e:
            print(f"Error updating RSVP: {e}")
            return False




def get_sheets_service() -> Generator[SheetsService]:
    """Get or create the sheets service singleton. FastAPI dependency."""
    global _sheets_service
    if _sheets_service is None:
        _sheets_service = SheetsService()
    try:
        yield _sheets_service
    finally:
        # Cleanup if needed (currently no cleanup required)
        pass

SheetsServiceDependency = Annotated[SheetsService, Depends(get_sheets_service)]