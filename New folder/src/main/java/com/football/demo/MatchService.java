package com.football.demo;

import com.football.demo.dto.MatchRequest;
import com.football.demo.exception.BadRequestException;
import com.football.demo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MatchService {

    private final MatchRepository repository;
    private final TeamRepository teamRepository;

    public MatchService(MatchRepository repository, TeamRepository teamRepository) {
        this.repository = repository;
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    public List<Match> getAllMatches() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Match> searchMatches(Long teamId, String status) {
        if (teamId != null) {
            return repository.findByHomeTeamIdOrAwayTeamId(teamId, teamId);
        }
        if (status != null && !status.isBlank()) {
            return repository.findByStatusIgnoreCase(status.trim());
        }
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Match getMatchById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + id));
    }

    public Match createMatch(MatchRequest request) {
        validateMatchRequest(request);
        Match match = new Match();
        applyRequest(match, request);
        return repository.save(match);
    }

    public Match updateMatch(Long id, MatchRequest request) {
        Match match = getMatchById(id);
        validateMatchRequest(request);
        applyRequest(match, request);
        return repository.save(match);
    }

    public void deleteMatch(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Match not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void validateMatchRequest(MatchRequest request) {
        if (!teamRepository.existsById(request.getHomeTeamId())) {
            throw new ResourceNotFoundException("Home team not found with id: " + request.getHomeTeamId());
        }
        if (!teamRepository.existsById(request.getAwayTeamId())) {
            throw new ResourceNotFoundException("Away team not found with id: " + request.getAwayTeamId());
        }
        if (request.getHomeTeamId().equals(request.getAwayTeamId())) {
            throw new BadRequestException("Home team and away team must be different");
        }
    }

    private void applyRequest(Match match, MatchRequest request) {
        match.setHomeTeamId(request.getHomeTeamId());
        match.setAwayTeamId(request.getAwayTeamId());
        match.setMatchDate(request.getMatchDate());
        match.setVenue(request.getVenue());
        match.setStatus(request.getStatus());
        match.setHomeScore(request.getHomeScore());
        match.setAwayScore(request.getAwayScore());
    }
}
