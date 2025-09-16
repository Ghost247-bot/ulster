# Database Table Editor

A comprehensive table editor interface for managing Supabase database tables directly from the admin panel.

## Features

### 🗄️ **Table Management**
- View all database tables with row counts
- Browse table schemas and column information
- Support for all major PostgreSQL data types

### 📊 **Data Operations**
- **View**: Paginated table data with search and sorting
- **Create**: Add new rows with form validation
- **Update**: Edit existing rows inline
- **Delete**: Remove rows with confirmation

### 🔍 **Advanced Features**
- Real-time search across table columns
- Sortable columns (ascending/descending)
- Pagination with configurable page sizes
- Foreign key relationship support
- Data type-aware input fields

### 🔒 **Security**
- Admin-only access with role-based permissions
- Row Level Security (RLS) integration
- Safe SQL query execution (SELECT only)
- Input validation and sanitization

## Database Tables Supported

The Table Editor supports all tables in your Supabase database:

- **accounts** - User bank accounts
- **cards** - Credit/debit cards
- **profiles** - User profile information
- **notifications** - System notifications
- **transactions** - Financial transactions
- **banners** - Website banners
- **user_financial_goals** - User financial goals
- **user_upcoming_bills** - Upcoming bill reminders
- **user_statistics_cards** - Dashboard statistics
- **Investment** - Investment accounts
- **card_transactions** - Card transaction history

## Usage

### Accessing the Table Editor

1. Log in as an admin user
2. Navigate to the admin panel
3. Click on "Table Editor" in the navigation menu
4. Select a table from the dropdown

### Viewing Data

- **Search**: Use the search box to find specific records
- **Sort**: Click column headers to sort data
- **Paginate**: Use the pagination controls at the bottom
- **Filter**: Adjust page size (25, 50, or 100 records per page)

### Creating New Records

1. Click the "Add Row" button
2. Fill in the required fields (marked with *)
3. Optional fields can be left empty if nullable
4. Click "Save" to create the record

### Editing Records

1. Click "Edit" on any row
2. Modify the fields as needed
3. Click "Save" to update the record
4. Click "Cancel" to discard changes

### Deleting Records

1. Click "Delete" on any row
2. Confirm the deletion in the popup
3. The record will be permanently removed

## Data Types Supported

### Text Types
- `text` - Multi-line text input
- `varchar` - Single-line text input
- `char` - Fixed-length text

### Numeric Types
- `integer` - Whole numbers
- `bigint` - Large whole numbers
- `numeric` - Decimal numbers with precision
- `decimal` - Decimal numbers

### Date/Time Types
- `date` - Date picker
- `timestamp` - Date and time picker
- `timestamptz` - Timezone-aware date/time

### Boolean Types
- `boolean` - Yes/No dropdown

### Special Types
- `uuid` - UUID strings
- `json` - JSON data (as text input)

## Security Considerations

### Admin Access Only
- Table Editor is restricted to admin users only
- Uses Supabase RLS policies for data access control
- All operations respect existing database permissions

### Safe Operations
- Only SELECT queries are allowed for custom SQL
- Dangerous operations (DROP, DELETE, etc.) are blocked
- Input validation prevents SQL injection

### Data Protection
- Sensitive data (SSN, passwords) should be handled carefully
- Consider implementing additional encryption for sensitive fields
- Regular backups recommended before bulk operations

## Technical Implementation

### Architecture
```
TableEditor (React Component)
    ↓
TableEditorService (Service Layer)
    ↓
Supabase Client (Database Layer)
    ↓
PostgreSQL Database
```

### Key Files
- `src/components/ui/TableEditor.tsx` - Main UI component
- `src/lib/tableEditorService.ts` - Database service layer
- `src/pages/admin/TableEditor.tsx` - Admin page wrapper
- `supabase/migrations/20241224_add_table_editor_functions.sql` - Database functions

### Database Functions
- `get_table_info()` - Returns table schema information
- `get_table_row_counts()` - Returns row counts for all tables
- `get_comprehensive_table_info()` - Returns structured table data
- `execute_safe_sql()` - Executes safe SELECT queries

## Customization

### Adding New Tables
Tables are automatically detected from the database schema. No code changes needed.

### Custom Field Types
To add support for new data types, modify the `renderInput` function in `TableEditor.tsx`.

### Styling
The component uses Tailwind CSS classes and can be customized by modifying the className props.

## Troubleshooting

### Common Issues

**"Failed to load tables"**
- Check database connection
- Verify admin permissions
- Ensure database functions are installed

**"Failed to save row"**
- Check required field validation
- Verify data type compatibility
- Check RLS policies

**"Permission denied"**
- Ensure user has admin role
- Check Supabase RLS policies
- Verify authentication status

### Performance Tips

- Use pagination for large tables
- Implement search filters to reduce data load
- Consider adding database indexes for frequently searched columns
- Monitor query performance in Supabase dashboard

## Future Enhancements

### Planned Features
- Bulk operations (import/export)
- Advanced filtering options
- Table relationship visualization
- Query builder interface
- Data validation rules
- Audit logging

### Integration Opportunities
- CSV import/export
- Excel file support
- Real-time data synchronization
- Advanced search with full-text indexing
- Custom field validators

## Support

For issues or questions about the Table Editor:
1. Check the browser console for error messages
2. Verify database permissions and RLS policies
3. Test with a simple table first
4. Contact the development team for advanced issues

---

**Note**: This Table Editor provides powerful database management capabilities. Always exercise caution when modifying production data and ensure proper backups are in place.
