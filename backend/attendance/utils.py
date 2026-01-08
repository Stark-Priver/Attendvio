"""
Utility functions for geofencing calculations.
"""
import math


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points on the earth.
    Uses the Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point (in decimal degrees)
        lat2, lon2: Latitude and longitude of second point (in decimal degrees)
    
    Returns:
        Distance in meters
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in meters
    r = 6371000
    
    return c * r


def is_within_geofence(student_lat, student_lon, center_lat, center_lon, radius):
    """
    Check if a student's location is within the geofence.
    
    Args:
        student_lat, student_lon: Student's current location
        center_lat, center_lon: Center of the geofence
        radius: Radius of the geofence in meters
    
    Returns:
        Tuple: (is_within: bool, distance: float)
    """
    distance = haversine_distance(student_lat, student_lon, center_lat, center_lon)
    is_within = distance <= radius
    
    return is_within, distance
