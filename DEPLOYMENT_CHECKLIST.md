# Production Deployment Checklist

## Pre-Deployment

### Backend (Django)

- [ ] Set `DEBUG=False` in production settings
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with production domain(s)
- [ ] Set up production PostgreSQL database
- [ ] Configure database backups (automated daily backups)
- [ ] Set up Redis for caching (optional but recommended)
- [ ] Configure email backend for notifications
- [ ] Set up SSL certificates (Let's Encrypt recommended)
- [ ] Configure static files serving (Whitenoise or CDN)
- [ ] Set up logging and monitoring
- [ ] Configure Sentry or similar error tracking
- [ ] Set appropriate `CORS_ALLOWED_ORIGINS`
- [ ] Review and tighten security settings
- [ ] Run security checks: `python manage.py check --deploy`
- [ ] Set up environment variables properly
- [ ] Configure rate limiting
- [ ] Set up database connection pooling
- [ ] Create database indexes if needed
- [ ] Run all migrations on production database
- [ ] Create superuser account
- [ ] Test all API endpoints

### Frontend (Mobile)

- [ ] Update `API_BASE_URL` to production URL
- [ ] Test on real devices (iOS and Android)
- [ ] Optimize images and assets
- [ ] Remove console.log statements
- [ ] Test geofencing with real GPS
- [ ] Verify location permissions work correctly
- [ ] Test token refresh logic
- [ ] Test offline behavior
- [ ] Build production APK/IPA
- [ ] Test production builds
- [ ] Set up crash reporting (Sentry)
- [ ] Configure app signing (Android & iOS)
- [ ] Prepare app store assets (screenshots, description)
- [ ] Test in-app navigation flows
- [ ] Verify all API integrations

## Infrastructure Setup

### Server Configuration

- [ ] Set up Ubuntu/Debian server
- [ ] Configure firewall (ufw)
- [ ] Install and configure Nginx
- [ ] Install and configure Gunicorn
- [ ] Set up systemd service for Django app
- [ ] Configure Nginx as reverse proxy
- [ ] Set up SSL with certbot
- [ ] Configure automatic SSL renewal
- [ ] Set up log rotation
- [ ] Configure server monitoring
- [ ] Set up automated backups

### Database

- [ ] Set up PostgreSQL on separate server (recommended)
- [ ] Configure PostgreSQL for production
- [ ] Set up connection limits
- [ ] Configure backup strategy
- [ ] Set up replication (if high availability needed)
- [ ] Create database user with limited privileges
- [ ] Configure pg_hba.conf for security
- [ ] Enable query logging (for debugging)
- [ ] Set up automated vacuum
- [ ] Monitor database performance

### Domain & DNS

- [ ] Purchase domain name
- [ ] Configure A records pointing to server IP
- [ ] Set up subdomain for API (api.attendvio.com)
- [ ] Configure CNAME if using load balancer
- [ ] Verify DNS propagation
- [ ] Set up email DNS records (SPF, DKIM, DMARC)

## Security

- [ ] Enable HTTPS everywhere
- [ ] Configure HSTS headers
- [ ] Set up secure cookies
- [ ] Enable CSRF protection
- [ ] Configure XSS protection headers
- [ ] Set up Content Security Policy
- [ ] Disable directory listing
- [ ] Remove server version headers
- [ ] Set up fail2ban for brute force protection
- [ ] Configure SSH key authentication only
- [ ] Disable root SSH login
- [ ] Set up firewall rules
- [ ] Enable automatic security updates
- [ ] Review OWASP Top 10 vulnerabilities
- [ ] Conduct security audit
- [ ] Set up intrusion detection

## Monitoring & Logging

- [ ] Set up application monitoring (e.g., New Relic)
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for critical errors
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor disk space
- [ ] Monitor memory usage
- [ ] Set up CPU usage alerts
- [ ] Monitor SSL certificate expiration
- [ ] Track user analytics

## Performance

- [ ] Enable database query caching
- [ ] Set up Redis for session storage
- [ ] Configure CDN for static files
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Minify CSS/JS (if applicable)
- [ ] Set up database connection pooling
- [ ] Configure appropriate worker count for Gunicorn
- [ ] Enable browser caching
- [ ] Optimize database queries (use select_related, prefetch_related)
- [ ] Set up load balancing (if needed)
- [ ] Configure rate limiting

## Mobile App Deployment

### iOS App Store

- [ ] Apple Developer account ($99/year)
- [ ] Create App Store Connect listing
- [ ] Prepare app metadata
- [ ] Create app screenshots (multiple devices)
- [ ] Write app description
- [ ] Set app category
- [ ] Set age rating
- [ ] Configure in-app purchases (if applicable)
- [ ] Submit for review
- [ ] Respond to review feedback
- [ ] Release app

### Google Play Store

- [ ] Google Play Developer account ($25 one-time)
- [ ] Create Play Console listing
- [ ] Prepare store listing
- [ ] Create app screenshots
- [ ] Write app description
- [ ] Set app category
- [ ] Set content rating
- [ ] Configure pricing & distribution
- [ ] Upload APK/AAB
- [ ] Submit for review
- [ ] Release app

## Testing

- [ ] Test user registration flow
- [ ] Test login/logout
- [ ] Test teacher creating sessions
- [ ] Test student marking attendance
- [ ] Test geofencing validation
- [ ] Test duplicate attendance prevention
- [ ] Test session reports
- [ ] Test CSV export
- [ ] Test token refresh
- [ ] Test error handling
- [ ] Test with slow network
- [ ] Test with no network
- [ ] Test on multiple devices
- [ ] Load testing
- [ ] Security testing
- [ ] Penetration testing

## Documentation

- [ ] Update README with production info
- [ ] Document API endpoints
- [ ] Create user guide for teachers
- [ ] Create user guide for students
- [ ] Document deployment process
- [ ] Document backup/restore procedures
- [ ] Document troubleshooting steps
- [ ] Create runbook for common issues
- [ ] Document server architecture
- [ ] Create disaster recovery plan

## Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all features work
- [ ] Test from different locations
- [ ] Monitor server resources
- [ ] Check backup system
- [ ] Verify SSL certificate
- [ ] Test email notifications
- [ ] Monitor user feedback
- [ ] Set up analytics
- [ ] Create feedback channel
- [ ] Plan for scaling
- [ ] Schedule regular maintenance
- [ ] Plan update strategy
- [ ] Set up A/B testing (if needed)

## Maintenance Schedule

### Daily
- Check error logs
- Monitor server health
- Review performance metrics

### Weekly
- Review user feedback
- Check database performance
- Review security logs
- Update dependencies (if needed)

### Monthly
- Security audit
- Performance review
- Backup verification
- SSL certificate check
- Update documentation

### Quarterly
- Major dependency updates
- Security penetration testing
- Disaster recovery drill
- Performance optimization review

## Emergency Contacts

```
DevOps Lead: [Name] - [Phone] - [Email]
Backend Lead: [Name] - [Phone] - [Email]
Mobile Lead: [Name] - [Phone] - [Email]
Database Admin: [Name] - [Phone] - [Email]
Security Team: [Email]
Hosting Provider: [Support Number]
```

## Rollback Plan

If deployment fails:
1. Stop Gunicorn service
2. Restore previous code version
3. Rollback database migrations (if any)
4. Restart services
5. Verify system functionality
6. Notify team
7. Investigate and fix issues
8. Re-deploy after testing

## Success Criteria

- [ ] Zero critical errors in first 24 hours
- [ ] API response time < 200ms (95th percentile)
- [ ] Mobile app rating > 4.0 stars
- [ ] Server uptime > 99.9%
- [ ] Zero data loss
- [ ] All features working as expected
- [ ] Positive user feedback

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Notes:** _______________
