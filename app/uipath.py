import subprocess
import json
import os

UIPATH_ROBOT_PATH = r"D:\UiPath\Studio\UiRobot.exe"
NUPKG_PATH = r"C:\Users\sbsra\OneDrive\Desktop\VIT\SEM 7\RPA Project\UI-Backend\RPA.Project.Final.1.0.8.nupkg"
ENTRY_XAML = "Main.xaml"


OUTPUT_FILE = r"C:\Users\sbsra\OneDrive\Desktop\VIT\SEM 7\RPA Project\UI-Backend\output.json" 

def run_uipath(arguments: dict):
    input_json = json.dumps(arguments)

    cmd = [
        UIPATH_ROBOT_PATH,
        "execute",
        "--file", NUPKG_PATH,
        "--entry", ENTRY_XAML,
        "--input", input_json
    ]

    try:
        # Run UiPath workflow
        subprocess.run(cmd, capture_output=True, text=True, check=True)

        # Read JSON output from file
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                final_list = json.load(f)
        else:
            final_list = []

        return {"success": True, "output": {"finalList": final_list}}

    except subprocess.CalledProcessError as e:
        return {"success": False, "error": e.stderr or str(e)}
    except Exception as e:
        return {"success": False, "error": str(e)}


ADD_TO_CALENDAR_NUPKG_PATH = r"C:\Users\sbsra\OneDrive\Desktop\VIT\SEM 7\RPA Project\UI-Backend\RPA.GC.1.0.4.nupkg"
ADD_TO_CALENDAR_ENTRY_XAML = "google calendar.xaml"  # adjust if different

def run_add_to_calendar(arguments: dict):
    """
    Run UiPath workflow to add event to calendar.
    Expects arguments: { 'in_summary': '...', 'in_mail': '...' }
    """
    input_json = json.dumps(arguments)

    cmd = [
        UIPATH_ROBOT_PATH,
        "execute",
        "--file", ADD_TO_CALENDAR_NUPKG_PATH,
        "--entry", ADD_TO_CALENDAR_ENTRY_XAML,
        "--input", input_json
    ]

    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        return {"success": True, "message": "Add to Calendar workflow executed successfully."}

    except subprocess.CalledProcessError as e:
        return {"success": False, "error": e.stderr or str(e)}
    except Exception as e:
        return {"success": False, "error": str(e)}
